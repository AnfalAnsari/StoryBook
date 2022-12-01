const router = require("express").Router();
const { ensureAuth } = require("../middleware/auth");
const { rawListeners } = require("../models/User");
const Story = require("../models/Story");

router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).lean().populate("user");

    if (story) {
      res.render("stories/edit", { story });
    } else {
      res.render("error/500");
    }

    // res.send(story);

    //res.render("stories/index", story);
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .lean()
      .sort({ createdAt: "desc" })
      .populate("user");
    // res.send(stories);
    res.render("stories/index", { stories });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    //  res.render("error/500");
  }
});

module.exports = router;
