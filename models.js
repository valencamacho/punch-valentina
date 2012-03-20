// export Schemas to web.js
module.exports.configureSchema = function(Schema, mongoose) {
    
    // finding 
    var Finding = new Schema({
      item          : String
    , description   : String
    , recommend   : String
    , image       : String
    //, bookNumber  : Number
    , date      : { type: Date, default: Date.now }
       });

    // add schemas to Mongoose
    mongoose.model('Finding', Finding);

};

