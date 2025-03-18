import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import { sequelize } from './conn';
import { AccountModel } from './accountModel.db';
import { winnerOfGame } from '../src/model/winnerOfGame.enum';

export class GamestateModel extends Model<InferAttributes<GamestateModel>, InferCreationAttributes<GamestateModel>>{
    declare username: ForeignKey<AccountModel['username']>;
    //These fields are here to mimic the Gamestate interface
    declare playerScore: number;
    declare opponentScore: number;
    declare gameName: string;
    declare gameThreshold: number;
    declare winnerOfGame: winnerOfGame;
    
    
}
GamestateModel.init(
    {
        username:{
            type: DataTypes.STRING,
            primaryKey:true
        },
        playerScore:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        opponentScore:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        gameName:{
            type: DataTypes.STRING,
            allowNull:false,
            primaryKey:true
        },
        gameThreshold:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        winnerOfGame:{
            type: DataTypes.STRING,
            allowNull:false
        }
    },
        {
            sequelize,
        

}
);