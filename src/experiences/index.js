import Express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import UsersModel from "../users/model.js";
import ExperiencesModel from "./model.js";

const experiencesRouter = Express.Router();

experiencesRouter.post("/:userId/experiences", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.params.userId);
    if (!user) {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
    const { experienceId } = await ExperiencesModel.create(req.body);
    res.status(201).send({ experienceId });
  } catch (error) {
    next(error);
  }
});

experiencesRouter.get("/:userId/experiences", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.params.userId);
    if (!user) {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
    const experiences = await ExperiencesModel.findAll();
    res.send(experiences);
  } catch (error) {
    next(error);
  }
});

experiencesRouter.get(
  "/:userId/experiences/:experienceId",
  async (req, res, next) => {
    try {
      const user = await UsersModel.findByPk(req.params.userId);
      if (!user) {
        next(
          createHttpError(404, `User with id ${req.params.userId} not found!`)
        );
      }
      const experience = await ExperiencesModel.findByPk(
        req.params.experienceId,
        {
          attributes: { exclude: ["createdAt", "updatedAt"] },
        }
      );
      if (experience) {
        res.send(experience);
      } else {
        next(
          createHttpError(
            404,
            `Experience with id ${req.params.experienceId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

experiencesRouter.put(
  "/:userId/experiences/:experienceId",
  async (req, res, next) => {
    try {
      const user = await UsersModel.findByPk(req.params.userId);
      if (!user) {
        next(
          createHttpError(404, `User with id ${req.params.userId} not found!`)
        );
      }
      const [numberOfUpdatedRows, updatedRecords] =
        await ExperiencesModel.update(req.body, {
          where: { experienceId: req.params.experienceId },
          returning: true,
        });
      if (numberOfUpdatedRows === 1) {
        res.send(updatedRecords[0]);
      } else {
        next(
          createHttpError(
            404,
            `Experience with id ${req.params.experienceId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

experiencesRouter.delete(
  "/:userId/experiences/:experienceId",
  async (req, res, next) => {
    const user = await UsersModel.findByPk(req.params.userId);
    if (!user) {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
    try {
      const numberOfDeletedRows = await ExperiencesModel.destroy({
        where: { experienceId: req.params.experienceId },
      });
      if (numberOfDeletedRows === 1) {
        res.status(204).send();
      } else {
        next(
          createHttpError(
            404,
            `Experience with id ${req.params.experienceId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default experiencesRouter;
