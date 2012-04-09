// export Schemas to web.js
module.exports.configureSchema = function(Schema, mongoose) {
    
    // finding 
    var Finding = new Schema({
      title         : String
    , item_id       : String
    , item          : String
    , description   : String
    , recommend     : String
    , image         : String
    //, bookNumber  : Number
    , date          : { type: Date, default: Date.now }
    , user_id       : String
    });

    // add schemas to Mongoose
    mongoose.model('Finding', Finding);

};

