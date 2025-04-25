from flask import redirect, jsonify,request
from flask_openapi3 import OpenAPI, Info, Tag
from flask_cors import CORS
from logger import logger

from urllib.parse import unquote

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from model import Session, Canteiro
from schemas import *


info = Info(title="Agroforestry Systems Design", version="1.0.0")
app = OpenAPI(__name__, info=info)
CORS(app)

# definindo tags
home_tag = Tag(name="Documentação", description="Seleção de documentação: Swagger, Redoc ou RapiDoc")
canteiro_tag = Tag(name="Plot", description="Visualização do Canteiro")

@app.get('/', tags=[home_tag])
def home():
    """
    Redireciona para /openapi,
    tela que permite a escolha do estilo de documentação. 
    """
    return redirect('/openapi')
    
@app.put('/canteiro', tags=[canteiro_tag],
         responses={"200": CanteiroSchemaDestribuido, "404": ErrorSchema})
def put_canteiro(body: CanteiroSchema):
    """
    Adiciona um canteiro a base e distribui a plantas

    Retorna uma representação do Canteiro com as plantas destribuidas.
    """
    logger.debug(f"Criando Canteiro")
    
    try: 
    
        canteiro = Canteiro(
            nome_canteiro=body.nome_canteiro,
            x_canteiro=body.x_canteiro,
            y_canteiro=body.y_canteiro,
            plantas_canteiro=body.plantas_canteiro.model_dump()
        )

        logger.debug(f"Adicionando canteiro de nome: '{canteiro.nome_canteiro}'")
        try:
            # criando conexão com a base
            with Session() as session:
                # adicionando canteiro
                session.add(canteiro)
                session.commit()
                logger.debug(f"Adicionado canteiro de nome: '{canteiro.nome_canteiro}'")
        except IntegrityError as e:
            # como a duplicidade do nome é a provável razão do IntegrityError
            error_msg = "Canteiro de mesmo nome já salvo na base :/"
            logger.warning(f"Erro ao adicionar canteiro '{canteiro.nome_canteiro}', {error_msg}")
            return {"mesage": error_msg}, 409
        
        except Exception as e:
            # caso um erro fora do previsto
            error_msg = "Não foi possível salvar novo canteiro :/"
            logger.warning(f"Erro ao adicionar planta '{canteiro.nome_canteiro}', {error_msg}")
            return {"mesage": error_msg}, 400
        # Destribuindo plantas pela area do canteiro
        logger.debug(f"Destribuindo plantas no canteiro: '{canteiro.nome_canteiro}'")
        canteiro.distribuir_plantas()
        return apresenta_canteiro_destribuido(canteiro), 200
    
    except Exception as e:
        # caso um erro fora do previsto
        error_msg = "Não foi possível gerar o Canteiro"
        logger.warning(f"Erro ao gerar o canteiro, {error_msg}")
        return jsonify({
            "error": error_msg,
            "status": "failed"
        }), 500
    
@app.get('/canteiro', tags=[canteiro_tag],
         responses={"200": CanteiroSchemaDestribuido, "404": ErrorSchema})
def buscar_canteiro(query: CanteiroBuscaSchema):
    """
    Busca canteiro apartir do nome.
    
    Retorna os dados de um canteiro, incluindo as plantas destribuidas.
    """
    nome = unquote(unquote(query.nome_canteiro))

    with Session() as session:
        canteiro = session.query(Canteiro).filter(Canteiro.nome_canteiro == nome).first()
        
        if not canteiro:
            error_msg = "Canteiro não encontrado na base :/"
            logger.warning(f"Erro ao buscar canteiro '{nome}', {error_msg}")
            return {"message": error_msg}, 404
        
        logger.debug(f"Destribuindo plantas no canteiro: '{nome}'")

        canteiro.distribuir_plantas()
        return apresenta_canteiro_destribuido(canteiro), 200
    
@app.post('/canteiro', tags=[canteiro_tag],
          responses={"200": CanteiroUpdateSchema, "409": ErrorSchema, "400": ErrorSchema})
def edit_canteiro(body: CanteiroUpdateSchema):
    """Busca canteiro apartir do nome e edita suas informções na base de dados
    
    Retorna confirmação da edição"""
    
    nome_canteiro = body.nome_canteiro

    logger.debug(f"Editando dados sobre canteiro #{nome_canteiro}")

    with Session() as session:
        canteiro_to_updt = session.query(Canteiro).filter(Canteiro.nome_canteiro == nome_canteiro).first()
        
        if not canteiro_to_updt:
            error_msg = "Canteiro não encontrada na base :/"
            logger.warning(f"Erro ao editar canteiro #'{nome_canteiro}', {error_msg}")
            return {"message": error_msg}, 404
        
        if body.x_canteiro is not None:
            canteiro_to_updt.x_canteiro = body.x_canteiro
        if body.y_canteiro is not None:
            canteiro_to_updt.y_canteiro = body.y_canteiro
        if body.plantas_canteiro is not None:
            # Garante que seja serializável para salvar como JSON
            if isinstance(body.plantas_canteiro, PlantasCanteiroSchema):
                canteiro_to_updt.plantas_canteiro = body.plantas_canteiro.model_dump()
            else:
                canteiro_to_updt.plantas_canteiro = body.plantas_canteiro

        session.commit()

        logger.debug(f"Editado canteiro #{nome_canteiro}")
        return {"message": "Canteiro atualizado", "nome_canteiro": nome_canteiro}


@app.get('/canteiros', tags=[canteiro_tag],
         responses={"200": ListagemCanteirosSchema, "404": ErrorSchema})
def get_canteiros():
    """Busca por todos canteiros cadastrados.
    
    Retorna um lista de todos os canteiros"""
    logger.debug("Coletando canteiros")
    try:
        with Session() as session:
            canteiros = session.query(Canteiro).all()
            session.commit()
            if not canteiros:
                return {"canteiros": []}, 200
            logger.debug(f"{len(canteiros)} canteiros encontrados")
            return apresenta_canteiros(canteiros), 200
    except Exception as e:
        logger.error(f"Erro ao buscar canteiros: {str(e)}")
        return {"message": "Erro ao buscar canteiros"}, 500
        
@app.delete('/canteiro', tags=[canteiro_tag],
            responses={"200": CanteiroDelSchema, "404": ErrorSchema})
def del_canteiro(query: CanteiroBuscaSchema):
    """Deleta um Canteiro a partir do nome da canteiro informado

    Retorna uma mensagem de confirmação da remoção.
    """
    canteiro_to_del = unquote(unquote(query.nome_canteiro))
    logger.debug(f"Deletando dados sobre Canteiro #{canteiro_to_del}")
    # criando conexão com a base
    with Session() as session:
        # fazendo a remoção
        del_canteiro = session.query(Canteiro).filter(Canteiro.nome_canteiro == canteiro_to_del).delete()
        session.commit()
    if del_canteiro:
        # retorna a representação da mensagem de confirmação
        logger.debug(f"Deletado Canteiro #{canteiro_to_del}")
        return {"mesage": "Canteiro removido", "nome_Canteiro": canteiro_to_del}
    else:
        # se o Canteiro não foi encontrado
        error_msg = "Canteiro não encontrado na base :/"
        logger.warning(f"Erro ao deletar Canteiro #'{canteiro_to_del}', {error_msg}")
        return {"message": error_msg}, 404
    
if __name__ == '__main__':
    app.run(debug=True)