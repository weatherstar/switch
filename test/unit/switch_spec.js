import Switch from 'src/switch'
describe('Test init.', function () {
    it('mySwitch is instance of Switch', function () {
        var mySwitch = new Switch();
        expect(mySwitch instanceof Switch).toBe(true);
    });
    it('test',function () {
        expect(true).toBe(true);
    })
});