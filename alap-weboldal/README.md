# Online Coaching – alap weboldal (csak frontend)

Egyszerűsített, statikus változata a teljes Bence Online Coaching oldalnak: ugyanaz a design (sötét + lime,
Archivo / Inter / JetBrains Mono) és ugyanazok az adatok (termékek, árak), backend nélkül.

## Oldalak

| Fájl | Tartalom |
|---|---|
| `index.html` | Főoldal: hero, ajánlatok, folyamat, csomag-összehasonlítás, GYIK |
| `coaching.html` | Online coaching részletei, ár, elvárások, folyamat |
| `edzestervek.html` | A 6 kész edzésterv |
| `termekek.html` | Minden termék kategóriaszűrővel |
| `kalkulator.html` | Kalóriakalkulátor (Mifflin–St Jeor, makrókkal) |
| `rolam.html` | Bence bemutatkozása |
| `kapcsolat.html` | Elérhetőségek + üzenet űrlap (csak ellenőrzés, nem küld el semmit) |
| `kosar.html` | Kosár (a böngészőben, `localStorage`-ban tárolva; fizetés csak a teljes verzióban) |

## Megnyitás

- **VS Code Live Server**: jobb klikk az `index.html`-en → *Open with Live Server*.
- Dupla kattintással is megnyílik, de `file://` címről a böngésző nem tölti be a saját betűtípusokat
  (biztonsági szabály), ezért akkor tartalék betű látszik.

## Felépítés

- `css/style.css` – minden stílus, a tetején a design tokenek (`:root`)
- `js/data.js` – termékek és árak (a kosár ebből számol)
- `js/main.js` – mobil menü, kosár, szűrő, kalkulátor, kapcsolati űrlap
- `fonts/`, `img/` – helyi betűtípusok (SIL OFL 1.1) és optimalizált képek
