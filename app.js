const express = require("express");
const bodyParser = require("body-parser");
const date = require("./date.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
// app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Database
const databaseName = "todolistDB";
const password = "4ouyGuoPtjbfsYnC";

const mongoose = require("mongoose");
mongoose.connect(
  `mongodb+srv://thenightking011:${password}@cluster0.k559dhx.mongodb.net/${databaseName}?retryWrites=true&w=majority&appName=Cluster0`
);

const itemSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
});

const Items = mongoose.model("Item", itemSchema);

const item1 = new Items({ name: "Buy Food" });
const item2 = new Items({ name: "Cook Food" });
const item3 = new Items({ name: "Eat Food" });

// const defaultItems = [item1, item2, item3];

// const insertItems = async () => {
//   try {
//     await Items.insertMany(defaultItems);
//     console.log("Added default items!");
//   } catch (error) {
//     console.log(`${error.message}`);
//   }
// };
// insertItems();

const findItems = async () => {
  const items = await Items.find({});
  const list = items.map((item) => item.name);
  return list;
};

app.get("/favicon.ico", (req, res) => res.status(204));

app.get("/", (req, res) => {
  findItems().then((list) => {
    const day = date();
    res.render("list", { kindOfDay: day, items: list });
  });
});

app.post("/", async (req, res) => {
  const item = req.body.item.trim();
  const myItem = new Items({ name: item });

  // validations
  const regex = /^[a-zA-Z]+$/;
  const validRegex = regex.test(item);
  const emptySpace = item === "";

  if (emptySpace || !validRegex) {
    res.redirect("/");
  } else {
    myItem
      .save()
      .then(() => {
        console.log("Item added!");
        res.redirect("/");
      })
      .catch((error) => {
        console.log(`${error.message}`);
        res.redirect("/");
      });
  }
});

app.post("/delete", async (req, res) => {
  try {
    const filter = req.body.checkbox;
    await Items.deleteOne({ name: filter });
    console.log("Deleted Item!");
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000...");
});
