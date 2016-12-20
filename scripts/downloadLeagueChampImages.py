import urllib
import json

def downloadFiles():
    champNames = set()
    with open('data.json') as data_file:
        data = json.load(data_file)
        for i in range(len(data)):
            champNames.add(data[i]["key"])
    for name in champNames:
        urllib.urlretrieve("http://ddragon.leagueoflegends.com/cdn/6.20.1/img/champion/" + name + ".png", "images/" + name + ".png")

if __name__ == "__main__":
    downloadFiles()
