const express = require("express");
const router = express.Router();
const { blogsDB } = require("./mongo");

router.get("/hello-blogs", (req, res, next) => {
  res.json({ message: "Hello from express" });
});

router.get("/all-blogs", async (req, res, next) => {
  const limit = Number(req.query.limit);
  const skip = Number(req.query.page);
  const sortField = req.query.sortField;
  const sortOrder = req.query.sortOrder;
  const filterField = req.query.filterField;
  const filterValue = req.query.filterValue.toLowerCase();

  try {
    const collection = await blogsDB().collection("posts");
    // const allBlogs = await collection.find({}).toArray();
    let filterObj = {};
    if (filterField && filterValue) {
      filterObj = { [filterField]: filterValue };
    }
    let sortObj = {};
    if (sortField && sortOrder) {
      let order = (sortOrder === "ASC") ? 1 : -1;
      sortObj = { [sortField]: order };
    }
    // console.log(filterObj);
    const dbResult = await collection
      .find(filterObj)
      .sort(sortObj)
      .limit(limit)
      .skip(skip)
      .toArray();
    //sends response
    console.log(dbResult);
    res.json(dbResult);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;