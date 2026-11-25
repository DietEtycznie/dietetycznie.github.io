import { MedicalCondition } from "../models/medical-condition.model";

export const SEED_MEDICAL_CONDITIONS: MedicalCondition[] = [
  {
    id: "cond-cukrzyca-typu-2",
    name: "Cukrzyca typu II",
    icon: "bloodtype",
    shortSummary:
      "Kontrola glikemii poprzez niski indeks glikemiczny, błonnik i regularne posiłki.",
    description:
      "Cukrzyca typu II to przewlekła choroba metaboliczna charakteryzująca się podwyższonym stężeniem glukozy we krwi wynikającym z insulinooporności oraz upośledzonego wydzielania insuliny. Odpowiednio zbilansowana dieta jest fundamentem leczenia i profilaktyki powikłań.",
    dietaryRecommendations: [
      "Wybieraj produkty o niskim indeksie i ładunku glikemicznym (IG < 55).",
      "Łącz węglowodany złożone ze źródłem białka, zdrowych tłuszczów i surowych warzyw.",
      "Spożywaj regularne posiłki (4–5 dziennie) bez podjadania między nimi.",
      "Zadbaj o wysoką podaż błonnika pokarmowego (min. 25–35 g dziennie).",
      "Unikaj rozgotowywania kasz, makaronów i warzyw — gotuj al dente.",
    ],
    lifestyleRecommendations: [
      "Minimum 150 minut umiarkowanej aktywności fizycznej tygodniowo + krótki spacer po posiłku.",
      "Regularna samokontrola glikemii i masy ciała.",
      "Dbanie o 7–8 godzin regenerującego snu (niedobór snu nasila insulinooporność).",
      "Odpowiednie nawodnienie — minimum 2 litry wody dziennie.",
    ],
    foodsToEat: [
      "Warzywa nieskrobiowe (brokuły, szpinak, cukinia, papryka, ogórki, rukola)",
      "Pełnoziarniste produkty zbożowe (kasza gryczana, płatki owsiane górskie, chleb żytni na zakwasie)",
      "Owoce jagodowe (maliny, borówki, truskawki, porzeczki)",
      "Chude białko (ryby morskie, drób, jaja, twaróg, strączki)",
      "Zdrowe tłuszcze (oliwa z oliwek, awokado, orzechy włoskie, siemię lniane)",
    ],
    foodsToAvoid: [
      "Słodkie napoje gazowane, soki owocowe i nektary",
      "Słodycze, wyroby cukiernicze i białe pieczywo pszenne",
      "Dania typu fast-food i żywność wysokoprzetworzona",
      "Tłuste mięsa przetworzone oraz tłuszcze trans",
      "Alkohol, szczególnie słodkie likiery i piwo",
    ],
    warnings: [
      "Przy przyjmowaniu insuliny lub pochodnych sulfonylomocznika każdą większą zmianę podaży węglowodanów konsultuj z diabetologiem.",
      "Zawsze miej przy sobie źródło szybko przyswajalnej glukozy na wypadek hipoglikemii.",
    ],
    pdfURL:
      "https://ncez.pzh.gov.pl/wp-content/uploads/2023/11/zalecenia_dietetycy_cukrzyca-typu-2-6.12.2023.pdf",
  },
  {
    id: "cond-nadcisnienie",
    name: "Nadciśnienie tętnicze",
    icon: "favorite",
    shortSummary: "Model diety DASH: ograniczenie sodu, wysoka podaż potasu, magnezu i warzyw.",
    description:
      "Nadciśnienie tętnicze to najczęstszy czynnik ryzyka chorób sercowo-naczyniowych. Złotym standardem żywieniowym jest dieta DASH (Dietary Approaches to Stop Hypertension), która realnie obniża ciśnienie skurczowe i rozkurczowe.",
    dietaryRecommendations: [
      "Ogranicz spożycie soli kuchennej do maksymalnie 5 g (1 płaska łyżeczka) na dobę.",
      "Zwiększ udział potasu, magnezu i wapnia w diecie (warzywa, owoce, chudy nabiał, orzechy).",
      "Zastąp sól świeżymi i suszonymi ziołami (bazylia, oregano, tymianek, koperek, czosnek).",
      "Włącz ryby morskie minimum 2 razy w tygodniu jako źródło kwasów omega-3.",
      "Czytaj etykiety — aż 70% sodu pochodzi z produktów gotowych i wędlin.",
    ],
    lifestyleRecommendations: [
      "Regularny trening aerobowy (marsz, rower, pływanie) 30 minut dziennie.",
      "Codzienne pomiary ciśnienia tętniczego w spoczynku.",
      "Redukcja stresu przewlekłego i całkowita rezygnacja z palenia tytoniu.",
      "Utrzymanie prawidłowego BMI oraz ograniczenie alkoholu.",
    ],
    foodsToEat: [
      "Świeże warzywa bogate w potas (pomidory, buraki, szpinak, brokuły, awokado)",
      "Owoce świeże i jagodowe",
      "Produkty pełnoziarniste (owies, kasza gryczana, ryż brązowy)",
      "Niesolone orzechy, pestki dyni i słonecznika",
      "Oliwa z oliwek, chude ryby i fermentowany nabiał bez soli",
    ],
    foodsToAvoid: [
      "Wędliny wysokoprzetworzone, konserwy mięsne i ryby wędzone",
      "Kostki rosołowe, gotowe mieszanki przypraw z glutaminianem sodu",
      "Słone przekąski (chipsy, paluszki, solone orzeszki)",
      "Sery pleśniowe, topione i bardzo słone sery żółte",
      "Napoje energetyczne i nadmiar kofeiny",
    ],
    warnings: [
      "Nie odstawiaj samodzielnie leków hipotensyjnych po poprawie wyników — decyzję zawsze podejmuje lekarz.",
      "Uważaj na grejpfruty przy niektórych lekach z grupy blokerów kanału wapniowego.",
    ],
    pdfURL:
      "https://ncez.pzh.gov.pl/wp-content/uploads/2021/03/zalecenia_dietetycy_nadcisnienie-tetnicze.pdf",
  },
  {
    id: "cond-celiakia",
    name: "Celiakia",
    icon: "grain",
    shortSummary: "Ścisła, dożywotnia dieta 100% bezglutenowa z dbałością o brak zanieczyszczeń.",
    description:
      "Celiakia to choroba autoimmunologiczna o podłożu genetycznym, w której spożycie glutenu (białka obecnego w pszenicy, życie i jęczmieniu) prowadzi do zaniku kosmków jelita cienkiego i zaburzeń wchłaniania. Jedynym skutecznym leczeniem jest ścisła dieta bezglutenowa.",
    dietaryRecommendations: [
      "Całkowicie wyeliminuj pszenicę (w tym orkisz, kamut), żyto, jęczmień oraz zwykły owies.",
      "Wybieraj wyłącznie certyfikowane produkty ze znakiem Przekreślonego Kłosa.",
      "Bazuj na naturalnie bezglutenowych zbożach: ryż, kasza gryczana, jaglana, komosa ryżowa, amarantus, kukurydza.",
      "Zwracaj uwagę na ukryty gluten w sosach sojowych, przyprawach, wędlinach i słodyczach.",
      "Dbaj o uzupełnianie żelaza, wapnia, witaminy D, kwasu foliowego i witaminy B12.",
    ],
    lifestyleRecommendations: [
      "Używaj oddzielnych desek do krojenia, tostera i sztućców do produktów bezglutenowych.",
      "Przechowuj produkty bezglutenowe na górnych półkach, aby uniknąć osypywania się mąki.",
      "Regularnie badaj przeciwciała (tTG IgA) i morfologię zgodnie z zaleceniami gastrologa.",
    ],
    foodsToEat: [
      "Kasza gryczana, kasza jaglana, komosa ryżowa, ryż biały i brązowy",
      "Certyfikowane płatki owsiane bezglutenowe",
      "Świeże nieprzetworzone warzywa, owoce, mięso, ryby i jaja",
      "Rośliny strączkowe, ziemniaki, bataty",
      "Naturalny nabiał bez zagęstników oraz czyste oleje roślinne",
    ],
    foodsToAvoid: [
      "Pieczywo, makarony, kasza manna, kuskus i bulgur z pszenicy",
      "Produkty z żyta, jęczmienia i niecertyfikowanego owsa",
      "Klasyczny sos sojowy, panierki, zupy w proszku",
      "Piwo jęczmienne i kawa zbożowa",
      "Wędliny i pasztety z dodatkiem błonnika pszennego lub bułki tartej",
    ],
    warnings: [
      "Nawet śladowe ilości glutenu (okruszki) mogą powodować uszkodzenie jelita mimo braku widocznych objawów.",
      "Nie wprowadzaj diety bezglutenowej przed zakończeniem pełnej diagnostyki serologicznej i endoskopowej.",
    ],
    pdfURL:
      "https://ncez.pzh.gov.pl/wp-content/uploads/2022/11/zalecenia-dietetycy-cdo-ncez-celiakia-2019.pdf",
  },
  {
    id: "cond-wrzodowa",
    name: "Choroba wrzodowa",
    icon: "medical_services",
    shortSummary:
      "Dieta łatwostrawna z ograniczeniem substancji pobudzających wydzielanie soku żołądkowego.",
    description:
      "Choroba wrzodowa żołądka i dwunastnicy wymaga żywienia oszczędzającego błonę śluzową przewodu pokarmowego. Kluczowe jest jedzenie częstych, niewielkich posiłków o umiarkowanej temperaturze oraz rezygnacja ze smażenia i ostrych przypraw.",
    dietaryRecommendations: [
      "Jedz 5–6 małych posiłków dziennie o stałych porach, dokładnie przeżuwając każdy kęs.",
      "Stosuj gotowanie w wodzie, na parze, duszenie bez obsmażania i pieczenie w rękawie.",
      "Unikaj potraw bardzo gorących oraz bardzo zimnych.",
      "Ogranicz silne wywary mięsne, ostre przyprawy oraz nadmiar surowego błonnika w fazie zaostrzenia.",
      "Wprowadź delikatne zupy kremy, owsianki, kisiele i gotowane warzywa.",
    ],
    lifestyleRecommendations: [
      "Całkowicie zrezygnuj z palenia papierosów — nikotyna zaburza gojenie błony śluzowej.",
      "Nie kładź się bezpośrednio po posiłku (odczekaj minimum 2 godziny).",
      "Unikaj przewlekłego przyjmowania leków z grupy NLPZ bez osłony lekarskiej.",
      "Ogranicz stres — oś mózg–jelito bezpośrednio wpływa na wydzielanie kwasu solnego.",
    ],
    foodsToEat: [
      "Zupy kremy warzywne (brokuł, dynia, marchew), delikatne kleiki i owsianki",
      "Chude mięso gotowane lub pieczone (indyk, kurczak, cielęcina) i chude ryby",
      "Jaja na miękko, omlety na parze, twaróg naturalny",
      "Warzywa gotowane i obrane (marchew, cukinia, ziemniaki, buraki)",
      "Pieczywo jasne lub graham czerstwe, banany, pieczone jabłka",
    ],
    foodsToAvoid: [
      "Potrawy smażone na głębokim tłuszczu i panierowane",
      "Kawa na czczo, mocna czarna herbata, napoje gazowane i alkohol",
      "Ostre przyprawy (chili, pieprz cayenne, curry, ocet, musztarda ostra)",
      "Owoce cytrusowe i kwaśne soki w okresie zaostrzenia objawów",
      "Warzywa wzdymające (kapusta, cebula surowa, czosnek surowy, groch)",
    ],
    warnings: [
      "Silny ból w nadbrzuszu, smoliste stolce lub nawracające wymioty wymagają pilnej konsultacji lekarskiej.",
    ],
    pdfURL:
      "https://ncez.pzh.gov.pl/wp-content/uploads/2021/03/zalecenia_dietetycy_choroba-wrzodowa-06-2024.pdf",
  },
  {
    id: "cond-hashimoto",
    name: "Hashimoto",
    icon: "spa",
    shortSummary:
      "Dieta przeciwzapalna bogata w białko, selen, cynk, żelazo, witaminę D i omega-3.",
    description:
      "Przewlekłe limfocytowe zapalenie tarczycy (Hashimoto) to schorzenie autoimmunologiczne prowadzące często do niedoczynności tarczycy. Celem dietoterapii jest wyciszenie stanu zapalnego, wsparcie pracy tarczycy oraz poprawa metabolizmu i energii.",
    dietaryRecommendations: [
      "Zadbaj o pełnowartościowe białko w każdym głównym posiłku (ok. 15–20% energii).",
      "Włącz źródła kwasów omega-3 (tłuste ryby morskie, olej lniany, orzechy włoskie, chia).",
      "Dostarczaj selenu, cynku i żelaza (ryby, jaja, pestki dyni, orzechy brazylijskie, chude mięso).",
      "Postaw na kolorowe warzywa i owoce jagodowe bogate w antyoksydanty.",
      "Eliminuj gluten lub laktozę wyłącznie przy potwierdzonej nietolerancji lub celiakii.",
    ],
    lifestyleRecommendations: [
      "Przyjmuj lewotyroksynę rano na czczo, popijając czystą wodą — śniadanie jedz min. 30–60 minut później.",
      "Unikaj bardzo niskokalorycznych, głodówkowych diet (obniżają konwersję T4 do T3).",
      "Suplementuj witaminę D3 po zbadaniu poziomu 25(OH)D.",
      "Dbaj o regenerację, sen i umiarkowany wysiłek (spacery, joga, trening siłowy).",
    ],
    foodsToEat: [
      "Ryby morskie (łosoś, makrela, dorsz, pstrąg)",
      "Jaja, drób, chude mięso i rośliny strączkowe",
      "Owoce jagodowe (maliny, borówki, porzeczki) oraz zielone warzywa liściaste",
      "Oliwa z oliwek, awokado, orzechy włoskie i pestki dyni",
      "Pełnoziarniste kasze (gryczana, jaglana, komosa, owies)",
    ],
    foodsToAvoid: [
      "Żywność wysokoprzetworzona, słodycze i cukry proste",
      "Tłuszcze trans, margaryny twarde i nadmiar kwasów omega-6",
      "Duże ilości surowych warzyw krzyżowych (gotowanie dezaktywuje goitrogeny)",
      "Produkty sojowe spożywane w krótkim odstępie od dawki lewotyroksyny",
    ],
    warnings: [
      "Nie stosuj suplementów jodu ani selenu w wysokich dawkach bez konsultacji z endokrynologiem — nadmiar jodu może zaostrzyć stan zapalny tarczycy.",
    ],
    pdfURL: "https://ncez.pzh.gov.pl/wp-content/uploads/2021/03/zalecenia_dietetycy_hashimoto.pdf",
  },
  {
    id: "cond-insulinoopornosc",
    name: "Insulinooporność",
    icon: "monitor_heart",
    shortSummary:
      "Stabilizacja poziomu insuliny: 3–4 sycące posiłki o niskim ładunku glikemicznym.",
    description:
      "Insulinooporność to obniżona wrażliwość tkanek na działanie insuliny, powodująca jej nadmierne wydzielanie, senność po posiłkach oraz trudności z redukcją masy ciała. Odpowiednia kompozycja talerza potrafi w pełni odwrócić ten stan.",
    dietaryRecommendations: [
      "Komponuj każdy posiłek z białka, zdrowego tłuszczu, dużej porcji warzyw i umiarkowanej porcji węglowodanów złożonych.",
      "Jedz 3–4 konkretne posiłki dziennie i zachowaj 3,5–4 godziny przerwy między nimi (bez podjadania).",
      "Rozpoczynaj dzień od śniadania białkowo-tłuszczowego lub owsianki z wysokim udziałem białka i orzechów.",
      "Owoce spożywaj zawsze w towarzystwie jogurtu naturalnego, twarogu lub orzechów.",
    ],
    lifestyleRecommendations: [
      "Trening oporowy (siłowy) 2–3 razy w tygodniu najsilniej zwiększa wrażliwość insulinową mięśni.",
      "10–15 minut spokojnego spaceru bezpośrednio po obiedzie znacząco obniża skok glukozy.",
      "Zadbaj o regularny rytm dobowy i redukcję poziomu kortyzolu.",
    ],
    foodsToEat: [
      "Jaja, ryby, drób, twaróg, skyr, tofu",
      "Awokado, oliwa z oliwek, orzechy, pestki, nasiona chia",
      "Zielone warzywa, papryka, pomidory, cukinia, kapustne",
      "Kasza gryczana, komosa ryżowa, pieczywo żytnie 100% na zakwasie",
      "Owoce o niskim IG: maliny, borówki, truskawki, grejpfrut",
    ],
    foodsToAvoid: [
      "Słodkie przekąski, batony, drożdżówki i płatki śniadaniowe",
      "Koktajle czysto owocowe i świeżo wyciskane soki",
      "Kawa z syropami smakowymi i słodkie napoje mleczne",
      "Rozgotowane makarony, biały ryż i tłuczone ziemniaki na gorąco",
    ],
    warnings: ["Stosowanie metforminy lub berberyny zawsze konsultuj z lekarzem prowadzącym."],
  },
  {
    id: "cond-refluks",
    name: "Refluks (GERD)",
    icon: "health_and_safety",
    shortSummary:
      "Łagodna dieta przeciwrefluksowa bez drażniących kwasów, tłuszczu i późnych kolacji.",
    description:
      "Choroba refluksowa przełyku (GERD) polega na zarzucaniu kwaśnej treści żołądkowej do przełyku, wywołującym zgagę i pieczenie. Właściwe nawyki żywieniowe potrafią zredukować objawy nawet bez zwiększania dawek leków.",
    dietaryRecommendations: [
      "Jedz mniejsze objętościowo posiłki 4–5 razy dziennie — przepełniony żołądek nasila refluks.",
      "Ostatni posiłek spożywaj minimum 3 godziny przed snem.",
      "Ogranicz tłuste potrawy, które spowalniają opróżnianie żołądka.",
      "Pij płyny głównie między posiłkami zamiast popijać duże ilości w trakcie jedzenia.",
    ],
    lifestyleRecommendations: [
      "Unieś wezgłowie łóżka o ok. 15 cm i śpij częściej na lewym boku.",
      "Unikaj ciasnej odzieży uciskającej brzuch oraz schylania się tuż po posiłku.",
      "Zadbaj o redukcję nadmiernej masy ciała, jeśli występuje.",
    ],
    foodsToEat: [
      "Płatki owsiane, ryż, makaron ryżowy, delikatne pieczywo",
      "Chudy drób, ryby gotowane lub pieczone, jajka",
      "Łagodne warzywa gotowane: brokuły, cukinia, marchew, ziemniaki",
      "Banany, pieczone jabłka, melony, awokado",
      "Napar z rumianku, siemię lniane (kisiel lniany)",
    ],
    foodsToAvoid: [
      "Czekolada, mięta pieprzowa, kawa i napoje gazowane",
      "Cytrusy, koncentrat pomidorowy, ostre przyprawy i ocet",
      "Cebula, czosnek w dużych ilościach oraz potrawy smażone",
      "Alkohol i tłuste sery",
    ],
    warnings: [
      "Przewlekła zgaga trwająca powyżej 2 tygodni lub trudności w przełykaniu wymagają diagnostyki gastroenterologicznej.",
    ],
  },
  {
    id: "cond-hipercholesterolemia",
    name: "Hipercholesterolemia",
    icon: "water_drop",
    shortSummary:
      "Obniżanie cholesterolu LDL: błonnik rozpuszczalny, sterole roślinne i tłuszcze nienasycone.",
    description:
      "Podwyższone stężenie cholesterolu całkowitego i frakcji LDL zwiększa ryzyko miażdżycy. Model diety Portfolio oraz śródziemnomorskiej pozwala obniżyć LDL poprzez zamianę tłuszczów nasyconych na nienasycone oraz wysoką podaż beta-glukanów.",
    dietaryRecommendations: [
      "Zastąp masło, smalec i tłuste mięsa oliwą z oliwek, olejem rzepakowym, awokado i orzechami.",
      "Jedz codziennie źródła błonnika rozpuszczalnego (płatki owsiane, jęczmień, siemię lniane, strączki, jabłka).",
      "Włącz nasiona roślin strączkowych (ciecierzyca, fasola, soczewica) co najmniej 3 razy w tygodniu.",
      "Spożywaj tłuste ryby morskie 2 razy w tygodniu.",
    ],
    lifestyleRecommendations: [
      "Regularny ruch aerobowy podnosi ochronną frakcję cholesterolu HDL.",
      "Utrzymuj prawidłowy obwód talii i kontroluj profil lipidowy co 6–12 miesięcy.",
      "Unikaj dymu tytoniowego, który utlenia cząsteczki LDL.",
    ],
    foodsToEat: [
      "Płatki owsiane, otręby, kasza gryczana i pełnoziarniste pieczywo",
      "Rośliny strączkowe (hummus, ciecierzyca, biała fasola)",
      "Oliwa z oliwek extra virgin, awokado, orzechy włoskie i migdały",
      "Łosoś, makrela, śledź oraz świeże warzywa i owoce jagodowe",
    ],
    foodsToAvoid: [
      "Tłuste mięsa czerwone, boczek, kiełbasy, parówki i podroby",
      "Tłusty nabiał (śmietana 30%, sery żółte pełnotłuste, masło w nadmiarze)",
      "Wyroby cukiernicze z olejem palmowym i tłuszczami trans",
      "Kawa niefiltrowana (po turecku / z french pressu) w dużych ilościach",
    ],
    warnings: [
      "Przy wysokim ryzyku sercowo-naczyniowym dieta wspiera, ale nie zastępuje zaleconej farmakoterapii (np. statyn).",
    ],
    pdfURL:
      "https://ncez.pzh.gov.pl/wp-content/uploads/2021/03/zalecenia_dietetycy_hipercholesterolemia.pdf",
  },
];
