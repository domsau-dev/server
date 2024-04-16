import express from "express";
import { readFile, writeFile } from "fs/promises";
import exphbs from "express-handlebars";

const PORT = 3000;
const WEB_DIR = "web";
const DATA_FILE = "zmones.json";

const app = express();
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.static(WEB_DIR, {
  index: false,
}));
app.use(express.urlencoded({
  extended: true,
}));
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    let zmones = await readFile(DATA_FILE, {
      encoding: "utf-8",
    });
    zmones = JSON.parse(zmones);

    res.render("zmones", {
      zmones,
      title: "Pilnas zmoniu sarasas",
    });
  } catch (err) {
    res.status(500).end(
      `<html><body>Ivyko klaida: ${err.message}</body></html>`,
    );
  }
});

app.get("/zmogus/:id?", async (req, res) => {
  try {
    let zmogus = null;
    if (req.params.id) {
      let zmones = await readFile(DATA_FILE, {
        encoding: "utf-8",
      });
      zmones = JSON.parse(zmones);

      const id = parseInt(req.params.id);

      zmogus = zmones.find((z) => z.id === id);
    }

    res.render("zmogus", {
      zmogus,
      title: "Vienas zmogus",
    });
  } catch (err) {
    res.status(500).end(
      `<html><body>Ivyko klaida: ${err.message}</body></html>`,
    );
  }
});

app.post("/zmogus", async (req, res) => {
  try {
    let zmones = await readFile(DATA_FILE, {
      encoding: "utf-8",
    });
    zmones = JSON.parse(zmones);

    if (req.body.id) {
      const id = parseInt(req.body.id);

      const zmogus = zmones.find((z) => z.id === id);
      if (zmogus) {
        zmogus.vardas = req.body.vardas;
        zmogus.pavarde = req.body.pavarde;
        zmogus.alga = parseFloat(req.body.alga);
      } else {
        res.render("nera", {
          id
        })
        return;
      }

    } else {
      let nextId = 0;
      for (const zmogus of zmones) {
        if (zmogus.id > nextId) {
          nextId = zmogus.id;
        }
      }
      nextId++;
      const zmogus = {
        id: nextId,
        vardas: req.body.vardas,
        pavarde: req.body.pavarde,
        alga: parseFloat(req.body.alga),
      };
      zmones.push(zmogus);
    }

    await writeFile(DATA_FILE, JSON.stringify(zmones, null, 2), {
      encoding: "utf-8",
    });

    res.redirect("/");
  } catch (err) {
    res.status(500).end(
      `<html><body>Ivyko klaida: ${err.message}</body></html>`,
    );
  }
});

app.get("/zmogus/:id/delete", async (req, res) => {
  try {
    let zmones = await readFile(DATA_FILE, {
      encoding: "utf-8",
    });
    zmones = JSON.parse(zmones);

    const id = parseInt(req.params.id);

    const index = zmones.findIndex((z) => z.id === id);

    if (index >= 0) {
      zmones.splice(index, 1);
      await writeFile(DATA_FILE, JSON.stringify(zmones, null, 2), {
        encoding: "utf-8",
      });
    }

    res.redirect("/");
  } catch (err) {
    res.status(500).end(
      `<html><body>Ivyko klaida: ${err.message}</body></html>`,
    );
  }
});

app.get("/json/zmogus", async (req, res) => {
  try {
    let zmones = await readFile(DATA_FILE, {
      encoding: "utf-8",
    });
    zmones = JSON.parse(zmones);
    res.set("Content-Type", "application/json");
    res.send(JSON.stringify(zmones));
    
  } catch (err) {
    res.status(500).end(
      `<html><body>Ivyko klaida: ${err.message}</body></html>`,
    );
  }
});

app.post("/json/zmogus", async (req, res) => {
  try {
    let zmones = await readFile(DATA_FILE, {
      encoding: "utf-8",
    });
    zmones = JSON.parse(zmones);

    if (req.body.id) {
      const id = parseInt(req.body.id);

      const zmogus = zmones.find((z) => z.id === id);
      if (zmogus) {
        zmogus.vardas = req.body.vardas;
        zmogus.pavarde = req.body.pavarde;
        zmogus.alga = parseFloat(req.body.alga);
      } else {
        res.render("nera", {
          id
        })
        return;
      }

    } else {
      let nextId = 0;
      for (const zmogus of zmones) {
        if (zmogus.id > nextId) {
          nextId = zmogus.id;
        }
      }
      nextId++;
      const zmogus = {
        id: nextId,
        vardas: req.body.vardas,
        pavarde: req.body.pavarde,
        alga: parseFloat(req.body.alga),
      };
      zmones.push(zmogus);
    }

    await writeFile(DATA_FILE, JSON.stringify(zmones, null, 2), {
      encoding: "utf-8",
    });

    res.status(201).end();
  } catch (err) {
    res.status(500).end(
      `<html><body>Ivyko klaida: ${err.message}</body></html>`,
    );
  }
});

// app.get("/", async (req, res) => {
//   try {
//     let template = await readFile("views/zmones.handlebars", {
//       encoding: "utf-8",
//     });
//     template = Handlebars.compile(template);

//     let zmones = await readFile(DATA_FILE, {
//       encoding: "utf-8",
//     });
//     zmones = JSON.parse(zmones);

//     res.send(template({ zmones }));
//   } catch (err) {
//     res.status(500).end(
//       `<html><body>Ivyko klaida: ${err.message}</body></html>`,
//     );
//   }
// });
// app.get("/", async (req, res) => {
//     try {
//         let zmones = await readFile(DATA_FILE, {
//             encoding: "utf-8"
//         });
//         zmones = JSON.parse(zmones);
//         let html = "<html><body>";
//         html += "<table>";
//         for (const zmogus of zmones) {
//             html += "<tr>";
//             html += "<td>";
//             html += zmogus.vardas;
//             html += "</td>";
//             html += "<td>";
//             html += zmogus.pavarde;
//             html += "</td>";
//             html += "<td>";
//             html += zmogus.alga;
//             html += "</td>";
//             html += "</tr>";
//         }
//         html += "</table>";
//         html += "</body></html>";
//         res.send(html);
//     }
//     catch (err) {
//         res.status(500).end(`<html><body>Ivyko klaida: ${err.message}</body></html>`);
//     }
// });

app.listen(PORT);
console.log(`Server started on port ${PORT}`);
