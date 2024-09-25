const aboutPageController = async (req, res) => {
    res.status(200).render("task/about");
  };
  
  const TNCPageController = async (req, res) => {
    res.status(200).render("task/tnc");
  };


  export {
    aboutPageController,
    TNCPageController,
  };