import yaml

config: dict = {}

with open("config.yaml", "rt", encoding="UTF-8") as file:
    config = yaml.load(file, Loader=yaml.FullLoader)
