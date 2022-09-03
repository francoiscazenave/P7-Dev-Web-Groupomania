const Post = require('../models/Post');
const fs = require('fs');
const dotenv = require("dotenv");
dotenv.config();

exports.createPost = (req, res, next) => {
  const postString = JSON.stringify(req.body);
  const postObject = JSON.parse(postString);
  delete postObject._id;
  delete postObject._userId;
  const post = new Post({
    ...postObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersdisLiked: [],
  });

  post.save()
    .then(() => { res.status(201).json({ message: 'Post enregistrée' }) })
    .catch(error => { res.status(400).json({ error }) })
};

exports.getOnePost = (req, res, next) => {
  Post.findOne({
    _id: req.params.id
  }).then(
    (post) => {
      res.status(200).json(post);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyPost = (req, res, next) => {
  const postString = JSON.stringify(req.body);
  const postObject = req.file ? {
    ...JSON.parse(postString),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete postObject._userId;
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (req.auth.userId === process.env.ADMIN_ID) {
        Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Post modifiée' }))
          .catch(error => res.status(401).json({ error }));
      } else if (post.userId != req.auth.userId) {
        res.status(401).json({ message: 'Utilisateur non autorisé' });
      } else {
        Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Post modifiée' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
      if (req.auth.userId === process.env.ADMIN_ID) {
        const filename = post.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Post.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Image supprimée !' }) })
            .catch(error => res.status(401).json({ error }));
        });
      } else if (post.userId != req.auth.userId) {
        res.status(401).json({ message: 'Utilisateur non autorisé' });
      } else {
        const filename = post.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Post.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Image supprimée !' }) })
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

exports.getAllPost = (req, res, next) => {
  Post.find()
    .then(
      (posts) => {
        res.status(200).json(posts);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};

exports.getPostLike = (req, res, next) => {
  const like = req.body.like;
  const userId = req.auth.userId;
  const postId = req.params.id;
  if (like === 1) {
    /* Utilisation des méthodes MongoDB via mongoose $inc pour incrémenter les likes dans la base et $push
    pour ajouter dans le tableaux le userID de l'utilisateur qui a liké */
    Post.updateOne({ _id: postId }, { $inc: { likes: +1 }, $push: { usersLiked: userId } })
      .then(() => res.status(200).json({ message: 'Like' }))
      .catch((error) => res.status(400).json({ error }))
  } else if (like === -1) {
    Post.updateOne({ _id: postId }, { $inc: { dislikes: +1 }, $push: { usersDisliked: userId } })
      .then(() => res.status(200).json({ message: 'Dislike' }))
      .catch((error) => res.status(400).json({ error }))
  } else if (like === 0) {
    Post.findOne({ _id: postId })
      .then((post) => {
        if (post.usersLiked.includes(userId)) {
          Post.updateOne({ _id: postId }, { $inc: { likes: -1 }, $pull: { usersLiked: userId } })
            .then(() => res.status(200).json({ message: 'Like retiré' }))
            .catch((error) => res.status(400).json({ error }))
        }
        if (post.usersDisliked.includes(userId)) {
          Post.updateOne({ _id: postId }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } })
            .then(() => {
              res.status(200).json({ message: 'Disklike retiré' })
            })
            .catch((error) => {
              res.status(400).json({ error })
            })
        }
      })
      .catch((error) => {
        res.status(404).json({ error })
      })
  }
};