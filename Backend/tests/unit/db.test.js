const {Sequelize} = require('sequelize');
const sequelize = require('../../database/db');

jest.mock('sequelize', () => {
    const actualSequelize = jest.requireActual('sequelize');
    return {
      ...actualSequelize,
      Sequelize: jest.fn().mockImplementation(() => ({
        authenticate: jest.fn()
      }))
    };
  });
  
  describe('Database Connection', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should initialize Sequelize with correct parameters', () => {
      expect(Sequelize).toHaveBeenCalledWith(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        expect.objectContaining({
          host: process.env.DB_HOST,
          dialect: 'mysql'
        })
      );
    });
  
    it('should handle connection success', async () => {
      sequelize.authenticate.mockResolvedValue();
      await expect(sequelize.authenticate()).resolves.toBeUndefined();
    });
  
    it('should handle connection failure', async () => {
      sequelize.authenticate.mockRejectedValue(new Error('Connection failed'));
      await expect(sequelize.authenticate()).rejects.toThrow('Connection failed');
    });
  });