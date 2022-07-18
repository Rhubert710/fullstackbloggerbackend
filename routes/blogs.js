const express = require("express");
const router = express.Router();
const { blogsDB } = require("./mongo");

router.get("/hello-blogs", (req, res, next) => {
  res.json({ message: "Hello from express" });
});

//GET BLOGS
router.get("/all-blogs", async (req, res, next) => {
  const limit = Number(req.query.limit);
  const skip = Number(req.query.page);
  const sortField = req.query.sortField;
  const sortOrder = req.query.sortOrder;
  const filterField = req.query.filterField;
  const filterValue = req.query.filterValue;

  try {
    const collection = await blogsDB().collection("posts");
    // // const allBlogs = await collection.find({}).toArray();
    let filterObj = {};
    if (filterField && filterValue) {
      filterObj = { [filterField]: filterValue };
    }
    let sortObj = {};
    if (sortField && sortOrder) {
      let order = (sortOrder === "ASC") ? 1 : -1;
      sortObj = { [sortField]: order };
    }
    console.log(filterObj);
    const dbResult = await collection
      .find(filterObj)
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .toArray();
    //sends response
    // console.log(dbResult);
    res.json(dbResult);
  } catch (e) {
    console.log(e);
  }
});

// POST BLOGS

router.post("/blog-submit", async (req, res) => {
  try {
    

    const collection = await blogsDB().collection("posts50");
    const sortedBlogArr = await collection.find({}).sort({ id: 1 }).toArray();
    const lastBlog = sortedBlogArr.length + 1;
    const title = req.body.title;
    const text = req.body.text;
    const author = req.body.author;
    const category = req.body.category;
    const date = new Date();

    const blogPost = {
      title: title,
      text: text,
      author: author,
      category: category,
      createdAt: date,
      lastModified: date,
      id: Number(lastBlog.id + 1),
    };
    await collection.insertOne(blogPost);
    res.status(200).json({ message: "Successfully Posted", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error posting blog." + error, success: false });
  }
});

module.exports = router;