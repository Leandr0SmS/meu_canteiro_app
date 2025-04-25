from sqlalchemy import Column, String, Integer, JSON

from  model import Base

class Canteiro(Base):
    __tablename__ = 'canteiros'

    id_canteiro = Column(Integer, primary_key=True)
    nome_canteiro = Column(String(140), unique=True, nullable=False)
    x_canteiro = Column(Integer, nullable=False)
    y_canteiro = Column(Integer, nullable=False)
    plantas_canteiro = Column(JSON(100000), nullable=False)

    def __init__(self, nome_canteiro:str, x_canteiro:int, y_canteiro:int, plantas_canteiro:dict):
        """

        Cria um Canteiro

        Parametros:
            nome_canteiro: O nome da canteiro
            x_canteiro: Valor do eixo X do canteiro
            y_canteiro: Valor do exico Y do canteiro
            plantas_canteiro: Plantas de cada estrato
        """
        self.nome_canteiro = nome_canteiro
        self.x_canteiro = x_canteiro
        self.y_canteiro = y_canteiro
        self.plantas_canteiro = plantas_canteiro
        
    def distribuir_plantas(self):
        
        # Definindo o canteiro
        canteiro = {
            "emergente": [],
            "alto": [],
            "medio": [],
            "baixo": []
        }
    
        canteiro_x = int(self.x_canteiro)
        canteiro_y = int(self.y_canteiro)
        
        # Ordenando as plantas por tempo de colheita (priorizando colheita mais rápida)
        plantas_ordenadas = sorted(self.plantas_canteiro['plantas'], key=lambda x: int(x['tempo_colheita']))
    
        # Distribuindo as plantas nos estratos
        for planta in plantas_ordenadas:
            sombra = int(planta['sombra'])
            espacamento = int(planta['espacamento'])
            estrato = planta['estrato']
            
            print('planta: ', planta)
    
            # Calculando a área disponível
            area_disponivel = canteiro_x * canteiro_y
            # Calculando a área que a planta pode ocupar no estrato
            estrato_disponivel = area_disponivel * (sombra / 100)
            # Calculando a área que a planta pode ocupar
            area_planta = (espacamento ** 2)
    
            # Verifica se a planta cabe no espaço disponível
            if area_planta > estrato_disponivel:
                continue
            num_plantas_possiveis = int(estrato_disponivel // area_planta)
            if num_plantas_possiveis == 0:
                continue
                
            num_plantas_y = 1
            num_plantas_x = num_plantas_possiveis
            espacamento_x = canteiro_x // (num_plantas_x + 1)
            espacamento_y = canteiro_y // (num_plantas_y + 1)
                
            while espacamento_x < espacamento:
                num_plantas_x = num_plantas_possiveis
                if espacamento_y < espacamento:
                    continue
                num_plantas_y += 1
                num_plantas_x /= num_plantas_y
                espacamento_x = int(canteiro_x // (num_plantas_x + 1))
                espacamento_y = int(canteiro_y // (num_plantas_y + 1))
            num_plantas_x = int(num_plantas_x)
            num_plantas_y = int(num_plantas_y)
            y = espacamento_y
    
            for i in range(num_plantas_y):
                x = espacamento_x
                
                for j in range(num_plantas_x):
                    
                    canteiro[estrato].append({
                        "nome_planta": planta['nome_planta'],
                        "estrato": estrato,
                        "posicao": [x, y],
                        "diametro": espacamento,
                        "tempo_colheita": planta['tempo_colheita']
                    })
                    x += espacamento_x
                y += espacamento_y
    
        self.plantas_canteiro_destribuidas = canteiro
        
    def __repr__(self):
        return f'Canteiro("{self.nome_canteiro}","{self.plantas_canteiro}")'
