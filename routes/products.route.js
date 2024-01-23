import express from "express";
import Products from "../schemas/products.schema.js";

const router = express.Router();

router.post("/products", async (req, res, next) => {
  try {
    const { title, content, password, author } = req.body;
    const product = new Products({
      title,
      content,
      password,
      author,
    });

    if (!product) {
      return res
        .status(400)
        .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    } else {
      await product.save();
      return res.status(201).json({ Message: "판매 상품을 등록하였습니다." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: "예기치 못한 에러가 발생하였습니다." });
  }
});

router.get("/products", async (req, res, next) => {
  const products = await Products.find()
    .select("_id title author status createdAt")
    .sort("-createdAt")
    .exec();

  res.status(200).json({ products });
});

router.get("/products/:productsId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const findOne = await Products.findOne(productId).exec();
    if (!findOne) {
      res.status(404).json({ errorMessage: "상품 조회에 실패하였습니다." });
    }
    res.status(200).json({ findOne });
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: "예기치 못한 에러가 발생하였습니다." });
  }
});

router.patch("/products/:productId", async (req, res, next) => {
  const { productId } = req.params;
  const { title, content, password, status } = req.body;

  try {
    const currentProduct = await Products.findById(productId).exec();
    if (!productId) {
      return res
        .status(400)
        .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }
    if (!currentProduct) {
      return res
        .status(404)
        .json({ errorMessage: "존재하지 않는 상품입니다." });
    }
    if (currentProduct.password !== password) {
      return res
        .status(401)
        .json({ error: "상품을 수정할 권한이 존재하지 않습니다." });
    } else {
      currentProduct.title = title;
      currentProduct.content = content;
      currentProduct.status = status;
      await currentProduct.save();
      res.status(200).json({ Message: "상품 정보를 수정하였습니다" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: "예기치 못한 에러가 발생하였습니다." });
  }
});

router.delete("/products/:productId", async (req, res, next) => {
  const { productId } = req.params;
  const { password } = req.body;

  const deleteProduct = await Products.findById(productId).exec();
  if (!productId) {
    return res
      .status(400)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
  }
  if (!deleteProduct) {
    return res.status(404).json({ errorMessage: "존재하지 않는 상품입니다." });
  }
  if (deleteProduct.password !== password) {
    return res
      .status(401)
      .json({ errorMessage: "상품을 삭제할 권한이 존재하지 않습니다." });
  } else {
    await Products.deleteOne({ _id: productId });
    return res.status(200).json({ Message: "상품을 삭제하였습니다." });
  }
});

export default router;
