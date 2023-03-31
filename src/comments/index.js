import Express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import PostsModel from "../posts/model.js";
import CommentsModel from "./model.js";

const commentsRouter = Express.Router();

commentsRouter.post("/:postId/comments", async (req, res, next) => {
  try {
    const post = await PostsModel.findByPk(req.params.postId);
    if (!post) {
      next(
        createHttpError(404, `Post with id ${req.params.postId} not found!`)
      );
    }
    const commentToAdd = { ...req.body, postId: req.params.postId };

    const { commentId } = await CommentsModel.create(commentToAdd);
    res.status(201).send({ commentId });
  } catch (error) {
    next(error);
  }
});

commentsRouter.get("/:postId/comments", async (req, res, next) => {
  try {
    const post = await PostsModel.findByPk(req.params.postId);
    if (!post) {
      next(
        createHttpError(404, `Post with id ${req.params.postId} not found!`)
      );
    }
    const comments = await CommentsModel.findAll();
    res.send(comments);
  } catch (error) {
    next(error);
  }
});

commentsRouter.get("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const post = await PostsModel.findByPk(req.params.postId);
    if (!post) {
      next(
        createHttpError(404, `Post with id ${req.params.postId} not found!`)
      );
    }
    const comment = await CommentsModel.findByPk(req.params.commentId, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (comment) {
      res.send(comment);
    } else {
      next(
        createHttpError(
          404,
          `Comment with id ${req.params.commentId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

commentsRouter.put("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const post = await PostsModel.findByPk(req.params.postId);
    if (!post) {
      next(
        createHttpError(404, `Post with id ${req.params.postId} not found!`)
      );
    }
    const [numberOfUpdatedRows, updatedRecords] = await CommentsModel.update(
      req.body,
      {
        where: { commentId: req.params.commentId },
        returning: true,
      }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(
          404,
          `Comment with id ${req.params.commentId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

commentsRouter.delete(
  "/:postId/comments/:commentId",
  async (req, res, next) => {
    const post = await PostsModel.findByPk(req.params.postId);
    if (!post) {
      next(
        createHttpError(404, `Post with id ${req.params.postId} not found!`)
      );
    }
    try {
      const numberOfDeletedRows = await CommentsModel.destroy({
        where: { commentId: req.params.commentId },
      });
      if (numberOfDeletedRows === 1) {
        res.status(204).send();
      } else {
        next(
          createHttpError(
            404,
            `Comment with id ${req.params.commentId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default commentsRouter;
