const app = require('../../server');


describe('Server',() => {
    it('should start the server successfully',(done) => {
        const server = app.listen(0,(err) => {
            expect(err).toBeUndefined();
            expect(server.listening).toBe(true);
            server.close(done);
        })
    })
})