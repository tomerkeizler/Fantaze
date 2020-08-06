const teamIdByName =
{
    "AFC_Ajax" : 194,
    "Atalanta_BC" : 499,
    "Atletico_Madrid" : 530,
    "Bayer_04_Leverkusen" : 168,
    "Bayern_Munich" : 157,
    "Borussia_Dortmund" : 165,
    "Chelsea_FC" : 49,
    "Club_Brugge_KV" : 569,
    "Dinamo_Zagreb" : 620,
    "FC_Barcelona" : 529,
    "FC_Lokomotiv_Moscow" : 597,
    "FC_Red_Bull_Salzburg" : 571,
    "FC_Shakhtar_Donetsk" : 550,
    "FC_Zenit_Saint_Petersburg" : 596,
    "Galatasaray_SK" : 645,
    "Inter_Milan" : 505,
    "Juventus_FC" : 496,
    "KRC_Genk" : 742,
    "Lille_OSC" : 79,
    "Liverpool_FC" : 40,
    "Manchester_City_FC" : 50,
    "Olympiacos_Piraeus" : 553,
    "Olympique_Lyonnais" : 80,
    "Paris_Saint_Germain_FC" : 85,
    "RB_Leipzig" : 173,
    "Real_Madrid_CF" : 541,
    "Red_Star_Belgrade" : 598,
    "SK_Slavia_Prague" : 560,
    "SL_Benfica" : 211,
    "SSC_Napoli" : 492,
    "Tottenham_Hotspur_FC" : 47,
    "Valencia_CF" : 532
};

export function getTeamShirtByIdMap() {
    const imagesRequire = require.context("./", false, /.*\.png$/);
    const teamShirtByIdMap = new Map();

    imagesRequire.keys().map( (item) => {
        let teamName = item.replace('./', '').replace('.png', '');
        let imagePath = imagesRequire(item)
        teamShirtByIdMap.set(teamIdByName[teamName], imagePath);
    });

    return teamShirtByIdMap;
}