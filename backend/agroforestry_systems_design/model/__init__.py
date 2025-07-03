from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

from logger import logger

import os

# importando os elementos definidos no modelo
from model.base import Base
from model.canteiro import Canteiro

# importando os elementos definidos no modelo
from model.base import Base

db_path = "database/"
# Verifica se o diretorio não existe
if not os.path.exists(db_path):
   # então cria o diretorio
   os.makedirs(db_path)

# url de acesso ao banco (essa é uma url de acesso ao sqlite local)
db_url = 'sqlite:///%s/db.sqlite3' % db_path

# cria a engine de conexão com o banco
engine = create_engine(db_url, echo=False)

# Instancia um criador de seção com o banco
Session = sessionmaker(bind=engine)

# cria o banco se ele não existir 
if not database_exists(engine.url):
   create_database(engine.url) 

   # cria as tabelas do banco, caso não existam
   Base.metadata.create_all(engine)
   
def popula_canteiros():
    from model.canteiro import Canteiro  # lazy import

    logger.info("Populando banco com canteiros iniciais...")

    canteiros_iniciais = [
        Canteiro(
            nome_canteiro="Canteiro1",
            x_canteiro=1100,
            y_canteiro=250,
            plantas_canteiro={
                "plantas": [
                    {
                        "espacamento": 200,
                        "estrato": "emergente",
                        "nome_planta": "Embaúba",
                        "sombra": 20,
                        "tempo_colheita": 1095
                    },
                    {
                        "espacamento": 100,
                        "estrato": "alto",
                        "nome_planta": "Jucara",
                        "sombra": 40,
                        "tempo_colheita": 2555
                    },
                    {
                        "espacamento": 50,
                        "estrato": "medio",
                        "nome_planta": "Pimenta-do-reino",
                        "sombra": 60,
                        "tempo_colheita": 1460
                    },
                    {
                        "espacamento": 40,
                        "estrato": "baixo",
                        "nome_planta": "Abacaxi",
                        "sombra": 80,
                        "tempo_colheita": 730
                    }
                ]
            }
        ),
        Canteiro(
            nome_canteiro="Canteiro2",
            x_canteiro=800,
            y_canteiro=300,
            plantas_canteiro={
                "plantas": [
                    {
                        "espacamento": 200,
                        "estrato": "emergente",
                        "nome_planta": "Coco",
                        "sombra": 30,
                        "tempo_colheita": 1095
                    },
                    {
                        "espacamento": 60,
                        "estrato": "alto",
                        "nome_planta": "Amora (Fruta)",
                        "sombra": 50,
                        "tempo_colheita": 1800
                    },
                    {
                        "espacamento": 50,
                        "estrato": "medio",
                        "nome_planta": "Almeirão / Radiche",
                        "sombra": 65,
                        "tempo_colheita": 70
                    },
                    {
                        "espacamento": 40,
                        "estrato": "baixo",
                        "nome_planta": "Abóbora",
                        "sombra": 75,
                        "tempo_colheita": 90
                    }
                ]
            }
        )
    ]

    with Session() as session:
        count = session.query(Canteiro).count()
        if count == 0:
            logger.debug("Base vazia, inserindo canteiros de exemplo")
            session.add_all(canteiros_iniciais)
            session.commit()
        else:
            logger.debug(f"Base já possui {count} canteiro(s), não inserindo mocks")

# Chamar isso no final do __init__.py (ou do app.py principal)
popula_canteiros()
    