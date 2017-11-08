var notes = (function() {
    var list = [];
    
    return {
        add: function(note) {
            if (/\S/.test(note)&&typeof note == 'string') {
                var item = {timestamp: Date.now(), text: note};
                list.push(item);
                return true;
            }
            return false;   
        },

        remove: function(index) {
            if (list.length<=index|index<0|typeof index != 'number') {
                return false;
            }
            list.splice(index, 1);
            return true;
        },
        
        count: function() {
            return list.length;
        },
        list: function() {
            return list;
        },
        find: function(str) {
            if (str&&/\S/.test(str)) {
                var specifiedarray = list.filter(function(note) {
                    if (note.text.toUpperCase().indexOf(str.toUpperCase()) >= 0) {
                        return note;
                    }
                });
                if (specifiedarray.length == 0) {
                    return false;
                }
                return specifiedarray;
            }
            return false;
        },
        clear: function() {
            list.splice(0, list.length);
        }

    };
}());
