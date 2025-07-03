from pydantic import BaseModel, Field
from typing import Optional, List
from model.canteiro import Canteiro

# Define nested schemas
class PlantaSchema(BaseModel):
    espacamento: int
    estrato: str
    nome_planta: str
    sombra: int
    tempo_colheita: int

class PlantasCanteiroSchema(BaseModel):
    plantas: List[PlantaSchema] = [
        PlantaSchema(
            espacamento=200,
            estrato="emergente",
            nome_planta="Embaúba",
            sombra=20,
            tempo_colheita=1095
        ),
        PlantaSchema(
            espacamento=100,
            estrato="alto",
            nome_planta="Jucara",
            sombra=40,
            tempo_colheita=2555
        ),
        PlantaSchema(
            espacamento=50,
            estrato="medio",
            nome_planta="Pimenta-do-reino",
            sombra=60,
            tempo_colheita=1460
        ),
        PlantaSchema(
            espacamento=40,
            estrato="baixo",
            nome_planta="Abacaxi",
            sombra=80,
            tempo_colheita=730
        )
    ]

class CanteiroSchema(BaseModel):
    """ Define como um novo canteiro deve ser representado
    """
    nome_canteiro: str = "Canteiro1"
    x_canteiro: int = 800
    y_canteiro: int = 200
    plantas_canteiro: PlantasCanteiroSchema  


class CanteiroSchemaDestribuido(BaseModel):
    """ Define como um novo canteiro deve ser representado
    """
    nome_canteiro: str = "Canteiro1"
    x_canteiro: int = 800
    y_canteiro: int = 200
    plantas_canteiro: PlantasCanteiroSchema
    plantas_destribuidas: dict = {
    "alto": [
      {
        "diametro": 100,
        "estrato": "alto",
        "nome_planta": "Jucara",
        "posicao": [
          114,
          100
        ],
        "tempo_colheita": 2555
      },
      {
        "diametro": 100,
        "estrato": "alto",
        "nome_planta": "Jucara",
        "posicao": [
          228,
          100
        ],
        "tempo_colheita": 2555
      }
    ],
    "baixo": [
      {
        "diametro": 40,
        "estrato": "baixo",
        "nome_planta": "Abacaxi",
        "posicao": [
          47,
          33
        ],
        "tempo_colheita": 730
      },
      {
        "diametro": 40,
        "estrato": "baixo",
        "nome_planta": "Abacaxi",
        "posicao": [
          94,
          33
        ],
        "tempo_colheita": 730
      }
    ],
    "emergente": [],
    "medio": [
      {
        "diametro": 50,
        "estrato": "medio",
        "nome_planta": "Pimenta-do-reino",
        "posicao": [
          58,
          50
        ],
        "tempo_colheita": 1460
      },
      {
        "diametro": 50,
        "estrato": "medio",
        "nome_planta": "Pimenta-do-reino",
        "posicao": [
          116,
          50
        ],
        "tempo_colheita": 1460
      }
    ]
  }

    
class CanteiroBuscaSchema(BaseModel):
    """ Define como deve ser a estrutura que representa a busca por nome. Que será
        feita apenas com base no nome do Canteiro.
    """
    nome_canteiro: str = "Canteiro1"

class BuscaCanteiroIdSchema(BaseModel):
    """ Define como deve ser a estrutura que representa a busca por id. Que será
        feita apenas com base no nome do Canteiro.
    """
    id_canteiro: int = 1


class CanteiroViewSchema(BaseModel):
    """ Define como um canteiro será retornado.
    """
    id_cantiero: int = 1
    nome_canteiro: str = "Canteiro1"

    
class CanteiroUpdateSchema(BaseModel):
    """ Define como um canteiro deve ser editado
    """
    nome_canteiro: str = "Canteiro1"
    x_canteiro: Optional[int] = None
    y_canteiro: Optional[int] = None
    plantas_canteiro: Optional[PlantasCanteiroSchema] = None

class CanteiroDelSchema(BaseModel):
    """ Define como deve ser a estrutura do dado retornado após uma requisição
        de remoção.
    """
    mesage: str
    nome_canteiro: str
    
    
class ListagemCanteirosSchema(BaseModel):
    """ Define como uma listagem dos Canteiro será retornada.
    """
    plantas:List[CanteiroSchema]


def apresenta_canteiro(canteiro: Canteiro):
    """ Retorna uma representação de um canteiro seguindo o schema definido em
        CanteiroViewSchema.
    """
    return {
        "nome_canteiro": canteiro.nome_canteiro,
        "x_canteiro": canteiro.x_canteiro,
        "y_canteiro": canteiro.y_canteiro,
        "plantas_canteiro": canteiro.plantas_canteiro
    }

def apresenta_canteiro_destribuido(canteiro: Canteiro):
    """ Retorna uma representação de um canteiro seguindo o schema definido em
        CanteiroViewSchema.
    """
    return {
        "nome_canteiro": canteiro.nome_canteiro,
        "x_canteiro": canteiro.x_canteiro,
        "y_canteiro": canteiro.y_canteiro,
        "plantas_canteiro": canteiro.plantas_canteiro,
        "plantas_destribuidas": canteiro.plantas_canteiro_destribuidas
    }

def apresenta_canteiros(canteiros: List[Canteiro]):
    """ Retorna uma representação de um canteiro seguindo o schema definido em
        CanteiroViewSchema.
    """
    result = []
    for canteiro in canteiros:
        result.append({
            "id_canteiro": canteiro.id_canteiro,
            "nome_canteiro": canteiro.nome_canteiro,
            "x_canteiro": canteiro.x_canteiro,
            "y_canteiro": canteiro.y_canteiro,
            "plantas_canteiro": canteiro.plantas_canteiro,
        })

    return {"canteiro": result}

