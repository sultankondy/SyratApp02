const { News } = require('./news.entity');

const getNews = async (req, res) => {
    try{
        const news = await News.findById(req.params.id);
        res.status(200).json(news);
    }catch(err){
        res.status(500).json(err);
    }
}

const getAllNews = async (req, res) => {
    const qNew = req.query.new;

    try{
        let news;

        if(qNew){
            news = await News.find().sort({createdAt: -1}).limit(1);
        } else {
            news = await News.find();
        }
        
        res.status(200).json(news);
    }catch(err){
        res.status(500).json(err);
    }
}


module.exports = {
    getAllNews,
    getNews,
}