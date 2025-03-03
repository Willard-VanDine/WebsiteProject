import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import { sequelize } from './conn';
import { AccountModel } from './accountmodel.db';

export class GamestateModel extends Model<InferAttributes<GamestateModel>, InferCreationAttributes<GamestateModel>>{
    declare username: ForeignKey<AccountModel['username']>;
    declare playerScore: number;
    declare opponentScore: number;
    
    
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
        }
      
    },
        {
            sequelize,
        

}
);