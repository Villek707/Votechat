describe('notes module', function () {
    beforeEach(function() {
        notes.clear();
        notes.add('first note');
        notes.add('second note');
        notes.add('third note');
        notes.add('fourth note');
        notes.add('fifth note');
    });

    describe('adding a note', function() {
        it("should be able to add a new note", function () {
            expect(notes.add('sixth note')).toBe(true);
            expect(notes.count()).toBe(6);
        });
    
        it("should ignore blank notes", function () {
            expect(notes.add('')).toBe(false);
            expect(notes.count()).toBe(5);
        });
    
        it('should ignore notes containing only whitespace', function() {
            expect(notes.add('   ')).toBe(false);
            expect(notes.count()).toBe(5);
        });
    
        it('should require a string parameter', function() {
            expect(notes.add()).toBe(false);
            expect(notes.count()).toBe(5);
        });
    });

    describe('deleting a note', function() {
        it('should be able to delete the first index', function() {
            expect(notes.remove(0)).toBe(true);
        });
        it('should be able to delete the last index', function() {
            expect(notes.remove(notes.count()-1)).toBe(true);
        });
        it('should return false if index is out of range', function() {
            expect(notes.remove(999)).toBe(false);
            expect(notes.remove(-1)).toBe(false);
        });
        it('should return false if the parameter is missing', function() {
            expect(notes.remove()).toBe(false);
        });
    }); 
    
    
    describe('finding a note', function() {
        it('should be able to find a note', function() {
            expect(notes.find('note')).not.toBe(false);
        });
        it('should be able to find a case-insensitive note', function() {
            expect(notes.find('NoTe')).not.toBe(false);
        });
        it('should be able to find a note with string "th"', function() {
            expect(notes.find('th')).not.toBe(false);
        });
        it('should not be able to find a note with string "six"', function() {
            expect(notes.find('six')).toBe(false);
        });
        it('should be able to find a note with string "four"', function() {
            expect(notes.find('four')).not.toBe(false);
        });
        it('should return false if parameter is blank', function() {
            expect(notes.find()).toBe(false);
        });
        it('should return false if string is whitespaces', function() {
            expect(notes.find('   ')).toBe(false);
        });
    });
});