import type { MigrationFn } from 'umzug';
import { Sequelize } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('genres', {
    genre_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
    },
  });

  await sequelize.getQueryInterface().createTable('category_genre', {
    genre_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'genres',
        key: 'genre_id',
      },
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'category_id',
      },
    },
  });
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('category_genre');
  await sequelize.getQueryInterface().dropTable('genres');
};
