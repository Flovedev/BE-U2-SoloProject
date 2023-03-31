import Express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import CommentsModel from "../comments/model.js";
import UsersModel from "../users/model.js";
import PostsModel from "./model.js";

const postsRouter = Express.Router();

postsRouter.post("/", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.body.userId);
    if (!user) {
      next(createHttpError(404, `User with id ${req.body.userId} not found!`));
    }
    const { postId } = await PostsModel.create(req.body);
    res.status(201).send({ postId });
  } catch (error) {
    next(error);
  }
});

postsRouter.get("/", async (req, res, next) => {
  try {
    const { count, rows } = await PostsModel.findAndCountAll({
      where: { ...res.searchQuery },
      limit: req.query.limit,
      offset: req.query.offset,
      attributes: { exclude: ["userId"] },
      include: [
        { model: UsersModel, attributes: ["userId", "name", "surname"] },
        {
          model: CommentsModel,
          attributes: ["comment"],
          include: [
            { model: UsersModel, attributes: ["userId", "name", "surname"] },
          ],
        },
      ],
      order: [
        [
          req.query.orderby ? req.query.orderby : "createdAt",
          req.query.direction ? req.query.direction.toUpperCase() : "ASC",
        ],
      ],
    });

    let response = {
      numberOfPosts: count,
      posts: rows,
    };

    const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    if (req.query.limit) {
      const links = {};
      if (req.query.offset) {
        if (parseInt(req.query.offset) !== 0) {
          if (parseInt(req.query.offset) - parseInt(req.query.limit) < 0) {
            links.prev = fullUrl.replace(
              `offset=${req.query.offset}`,
              "offset=0"
            );
          } else {
            links.prev = fullUrl.replace(
              `offset=${req.query.offset}`,
              `offset=${parseInt(req.query.offset) - parseInt(req.query.limit)}`
            );
          }
        }
        links.next = fullUrl.replace(
          `offset=${req.query.offset}`,
          `offset=${parseInt(req.query.offset) + parseInt(req.query.limit)}`
        );
      } else {
        links.next = `${fullUrl}&offset=${parseInt(req.query.limit)}`;
      }
      response = {
        numberOfPages: Math.ceil(count / req.query.limit),
        links,
        ...response,
      };
    } else if (req.query.offset) {
      response = {
        links: {
          prev: fullUrl.replace(`offset=${req.query.offset}`, "offset=0"),
        },
        ...response,
      };
    }

    res.send(response);
  } catch (error) {
    next(error);
  }
});

postsRouter.get("/:postId", async (req, res, next) => {
  try {
    const post = await PostsModel.findByPk(req.params.postId, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (post) {
      res.send(post);
    } else {
      next(
        createHttpError(404, `Post with id ${req.params.postId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

postsRouter.put("/:postId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await PostsModel.update(
      req.body,
      {
        where: { postId: req.params.postId },
        returning: true,
      }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(404, `Post with id ${req.params.postId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

postsRouter.delete("/:postId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await PostsModel.destroy({
      where: { postId: req.params.postId },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `Post with id ${req.params.postId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default postsRouter;
