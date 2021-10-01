// *****************************************************************************
// EXPRESS WEBSERVER IMPORT
// MAIN/DEFAULT WEB SERVER PARAMETERS
import express from "express";
const app = express();
const PORT = 4444;    // Sets default website port
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
const WEB = "web";
app.use(express.static(WEB, {    // Like "Default Document" on ISS
    index: ["index.html"]
}));

// ADDITIONAL WEB SERVER PARAMETERS 
// Suteikia funkcionaluma automatiskai iskaidyti URL'e esancius parametrus
// i atskirus objektus. Visu ju vertes tekstines, todel skaitines reiksmes reikia
// konvertuotis i skaicius.
app.use(express.urlencoded({
    extended: true,
}));

// imports css and other static content such us images, fonts
app.use(express.static('./public'));


// *****************************************************************************
// HANDLEBARS FOR EXPRESS WEB SERVER IMPORT 
import handleBars from "express-handlebars";
// app.engine('handlebars', handleBars()); // DEFAULT
app.engine(
    "handlebars",
    handleBars({
        helpers: {
            dateFormat: (date) => {
                if (date instanceof Date) {
                    let year = "0000" + date.getFullYear();
                    year = year.substr(-4);
                    let month = "00" + (date.getMonth() + 1);
                    month = month.substr(-2);
                    let day = "00" + date.getDate();
                    day = day.substr(-2);
                    return `${year}-${month}-${day}`;
                }
                return date;
            },
            eq: (param1, param2) => {
                return param1 === param2;
            },
        },
    }),
);

app.set('view engine', 'handlebars');
// *****************************************************************************
// IMPORT MYSQL 
import { connect, end, query } from "./db.js";
// *****************************************************************************



// *****************************************************************************
// ***************************** LENTELE ZMONES ********************************
// *****************************************************************************

// VISOS LENTELES SPAUSDINIMAS
app.get("/zmones", async (req, res) => {
    let conn;
    try {
        conn = await connect();
        const { results: zmones } = await query(
            conn,
            `
      select
        id, pavarde, vardas, gim_data, alga
      from zmones
      order by
        pavarde`,
        );
        res.render("zmones", { zmones });
    } catch (err) {
        res.render("klaida", { err });
    } finally {
        await end(conn);
    }
});

// VIENO IRASO HTML FORMOS GENERAVIMAS
app.get("/zmogus/:id?", async (req, res) => {
    // Tikriname ar yra perduotas id parametras.
    // id yra -> senas irasas ir forma uzpildom iraso duomenimis
    // id nera -> naujas irasas, formos laukai pateikiami tusti
    if (req.params.id) {
        const id = parseInt(req.params.id);
        if (!isNaN(id)) { // pasitikrinam ar id yra skaicius ir ar koks internautas neidejo savo tekstinio id
            let conn;
            try {
                conn = await connect();
                const { results: zmogus } = await query(
                    conn,
                    `
        select
            id, pavarde, vardas, gim_data, alga
        from zmones
        where id = ?`,
                    [id],
                );
                if (zmogus.length > 0) {
                    // pasitikrinam ar gavom norima irasa ir jei taip salia formuojam tentele
                    // is susijusios lenteles irasu
                    const { results: adresai } = await query(
                        conn,
                        `
            select
                adresai.id, adresas, miestas, valstybe, pasto_kodas
            from adresai left join zmones on zmones.id = adresai.zmones_id
            where zmones.id = ?
            order by adresas`,
                        [zmogus[0].id],
                    );
                    const { results: kontaktai } = await query(
                        conn,
                        `
            select
                kontaktai.id, tipas, reiksme
            from kontaktai left join zmones on zmones.id = kontaktai.zmones_id
            where zmones.id = ?
            order by tipas`,
                        [zmogus[0].id],
                    );
                    res.render("zmogus", { zmogus: zmogus[0], adresai, kontaktai });
                } else {
                    // Jei pagrindinis irasas nerastas permetam i visu irasu sarasa
                    // o galim parodyt klaidos forma, kad pagal id irasas nerastas
                    res.redirect("/zmones");
                }
            } catch (err) {
                // ivyko klaida gaunant duomenis
                res.render("klaida", { err });
            } finally {
                await end(conn);
            }
        } else {
            // Jei id buvo nurodytas ne skaicius permetam i visu irasu sarasa
            // o galim parodyt klaidos forma, kad id negali buti stringas
            res.redirect("/zmones");
        }
    } else {
        // Jei id nenurodytas vadinasi tai bus
        // naujo iraso ivedimas
        res.render("zmogus");
    }
});

// IRASO SAUGOJIIMAS
app.post("/zmogus", async (req, res) => {
    if (req.body.id) {
        // id yra -> irasa redaguojam
        // id nera -> kuriam nauja irasa
        const id = parseInt(req.body.id);
        if (
            // tikrinam duomenu teisinguma
            !isNaN(id) &&
            typeof req.body.vardas === "string" &&
            req.body.vardas.trim() !== "" &&
            typeof req.body.pavarde === "string" &&
            req.body.pavarde.trim() !== "" &&
            isFinite((new Date(req.body.gimData)).getTime()) &&
            isFinite(req.body.alga) && req.body.alga >= 0
        ) {
            let conn;
            try {
                conn = await connect();
                await query(
                    conn,
                    `
                    update zmones
                    set vardas = ? , pavarde = ?, gim_data = ?, alga = ?
                    where id = ?`,
                    [req.body.vardas, req.body.pavarde, new Date(req.body.gimData), req.body.alga, id],
                );
            } catch (err) {
                // ivyko klaida skaitant duomenis is DB
                res.render("klaida", { err });
                return;
            } finally {
                await end(conn);
            }
        } 
    } else {
        // jei nera id, kuriam nauja irasa
        if (
            typeof req.body.vardas === "string" &&
            req.body.vardas.trim() !== "" &&
            typeof req.body.pavarde === "string" &&
            req.body.pavarde.trim() !== "" &&
            isFinite((new Date(req.body.gimData)).getTime()) &&
            isFinite(req.body.alga) && req.body.alga >= 0
        ) {
            let conn;
            try {
                conn = await connect();
                await query(
                    conn,
                    `
                    insert into zmones
                    (vardas, pavarde, gim_data, alga)
                    values (?, ?, ?, ?)`,
                    [req.body.vardas, req.body.pavarde, new Date(req.body.gimData), req.body.alga],
                );
            } catch (err) {
                // ivyko klaida irasant duomenis i DB
                res.render("klaida", { err });
                return;
            } finally {
                await end(conn);
            }
        }
    }
    res.redirect("/zmones");
});

// IRASO TRYNIMAS
app.get("/zmogus/:id/del", async (req, res) => {
    const id = parseInt(req.params.id);
    if (!isNaN(id)) {
      let conn;
      try {
        conn = await connect();
        await query(
          conn,
          `
            delete from zmones
            where id = ?`,
          [id],
        );
      } catch (err) {
        // ivyko klaida gaunant trinant irasa is DB
        res.render("klaida", { err });
        return;
      } finally {
        await end(conn);
      }
    }
    res.redirect("/zmones");
});

// *****************************************************************************
// **************************** LENTELE ADRESAI ********************************
// *****************************************************************************

// VIENO IRASO HTML FORMOS GENERAVIMAS
app.get("/adresas/:id?", async (req, res) => {
    // Tikriname ar yra perduotas id parametras.
    // id yra -> senas irasas ir forma uzpildom iraso duomenimis
    // id nera -> naujas irasas, formos laukai pateikiami tusti
    if (req.params.id) {
        const id = parseInt(req.params.id);
        if (!isNaN(id)) { // pasitikrinam ar id yra skaicius ir ar koks internautas neidejo savo tekstinio id
            let conn;
            try {
                conn = await connect();
                const { results: adresas } = await query(
                    conn,
                    `
                    select
                        id, zmones_id, adresas, miestas, valstybe, pasto_kodas
                    from adresai
                    where id = ?`,
                    [id],
                );
                if (adresas.length > 0) {
                    // pasitikrinam ar gavom norima irasa ir jei taip salia formuojam tentele
                    // is susijusios lenteles irasu
                    res.render("adresas", { adresas: adresas[0] });
                } else {
                    // Jei pagrindinis irasas nerastas permetam i visu irasu sarasa
                    // o galim parodyt klaidos forma, kad pagal id irasas nerastas
                    res.redirect("/zmones");
                }
            } catch (err) {
                // ivyko klaida gaunant duomenis
                res.render("klaida", { err });
            } finally {
                await end(conn);
            }
        } else {
            // Jei id buvo nurodytas ne skaicius permetam i visu irasu sarasa
            // o galim parodyt klaidos forma, kad id negali buti stringas
            res.redirect("/zmones");
        }
    } else {
        // Jei id nenurodytas vadinasi tai bus
        // naujo iraso ivedimas
        res.render("adresas");
    }
});

// IRASO SAUGOJIIMAS
app.post("/adresas", async (req, res) => {
    if (req.body.id) {
        // id yra -> irasa redaguojam
        // id nera -> kuriam nauja irasa
        const id = parseInt(req.body.id);
        console.log('update ', req.body.adresas, req.body.miestas, req.body.valstybe, req.body.pastoKodas, id);

        if (
            // tikrinam duomenu teisinguma
            !isNaN(id) &&
            typeof req.body.adresas === "string" &&
            req.body.adresas.trim() !== "" &&
            typeof req.body.miestas === "string" &&
            req.body.miestas.trim() !== "" &&
            typeof req.body.valstybe === "string" &&
            req.body.valstybe.trim() !== "" &&
            typeof req.body.pastoKodas === "string" &&
            req.body.pastoKodas.trim() !== ""
        ) {
            let conn;
            try {
                conn = await connect();
                await query(
                    conn,
                    `
                    update adresai
                    set adresas = ? , miestas = ?, valstybe = ?, pasto_kodas = ?
                    where id = ?`,
                    [req.body.adresas, req.body.miestas, req.body.valstybe, req.body.pastoKodas, id],
                );
            } catch (err) {
                // ivyko klaida skaitant duomenis is DB
                res.render("klaida", { err });
                return;
            } finally {
                await end(conn);
            }
        } 
    } else {
        // jei nera id, kuriam nauja irasa
        const zmogusId = parseInt(req.params.zmogusId);
        console.log(req.body.adresas, req.body.miestas, req.body.valstybe, req.body.pastoKodas, req.params.zmogusId);
        if (
            !isNaN(zmogusId) &&
            typeof req.body.adresas === "string" &&
            req.body.adresas.trim() !== "" &&
            typeof req.body.miestas === "string" &&
            req.body.miestas.trim() !== "" &&
            typeof req.body.valstybe === "string" &&
            req.body.valstybe.trim() !== "" &&
            typeof req.body.pasto_kodas === "string" &&
            req.body.pasto_kodas.trim() !== ""
        ) {
            let conn;
            try {
                conn = await connect();
                await query(
                    conn,
                    `
                    insert into zmones
                    (adresas, miestas, valstybe, pasto_kodas, zmones_id)
                    values (?, ?, ?, ?, ?)`,
                    [req.body.adresas, req.body.miestas, req.body.valstybe, req.body.pastoKodas, zmogusId],
                );
            } catch (err) {
                // ivyko klaida irasant duomenis i DB
                res.render("klaida", { err });
                return;
            } finally {
                await end(conn);
            }
        }
    }
    res.redirect("/zmogus/" + req.body.zmogusId);
});
