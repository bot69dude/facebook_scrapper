import Page from '../models/Page.js';
import Post from '../models/Post.js';
import SocialMediaUser from '../models/SocialMediaUser.js';
import FacebookScraper from '../services/scraperService.js';

export const getPageByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    let page = await Page.findOne({ username });

    if (!page) {
      const scraper = new FacebookScraper(); // Initialize scraper
      await scraper.initialize();
      const pageData = await scraper.scrapePage(username);
      await scraper.close();

      page = await Page.create({
        name: pageData.name,
        username,
        url: pageData.url || '',
        facebookId: pageData.facebookId || undefined, 
        profilePic: pageData.profilePic || '',
        cloudinaryProfilePic: pageData.cloudinaryProfilePic || '',
        category: pageData.category || 'Unknown',
        totalFollowers: pageData.totalFollowers || 0,
        totalLikes: pageData.totalLikes || 0,
        website: pageData.website || '',
        email: pageData.email || '',
        creationDate: new Date()
      });

      await Promise.all(pageData.posts.map(postData => 
        Post.create({
          pageId: page._id,
          ...postData
        })
      ));
    }

    res.json(page);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getPagesByFilters = async (req, res) => {
  try {
    const { 
      minFollowers, 
      maxFollowers, 
      category, 
      name,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (minFollowers || maxFollowers) {
      query.totalFollowers = {};
      if (minFollowers) query.totalFollowers.$gte = parseInt(minFollowers);
      if (maxFollowers) query.totalFollowers.$lte = parseInt(maxFollowers);
    }

    if (category) query.category = new RegExp(category, 'i');
    if (name) query.name = new RegExp(name, 'i');

    const pages = await Page.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Page.countDocuments(query);

    res.json({
      pages,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPageFollowers = async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageDoc = await Page.findOne({ username });
    if (!pageDoc) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const followers = await SocialMediaUser.find({ 
      pageId: pageDoc._id,
      type: 'follower'
    })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await SocialMediaUser.countDocuments({ 
      pageId: pageDoc._id,
      type: 'follower'
    });

    res.json({
      followers,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPagePosts = async (req, res) => {
  try {
    const { username } = req.params;
    const { limit = 15 } = req.query;

    const pageDoc = await Page.findOne({ username });
    if (!pageDoc) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const posts = await Post.find({ pageId: pageDoc._id })
      .sort({ postDate: -1 })
      .limit(parseInt(limit));

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};