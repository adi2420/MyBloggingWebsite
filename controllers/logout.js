module.exports = (req, res) => {
    req.session.destroy(() => {
        console.log("I'm logging out");
        res.redirect('/')
    })
}