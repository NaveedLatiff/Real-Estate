import prisma from "../config/db.js"
import cloudinary from "../config/cloudinary.js"

export const addPost = async (req, res) => {
  try {
    const userId = req.userId

    const {
      title,
      price,
      images,
      address,
      city,
      bedroom,
      bathroom,
      latitude,
      longitude,
      type,
      property,
      postDetail,
    } = req.body

    if (
      !title ||
      !price ||
      !images ||
      !address ||
      !city ||
      !bedroom ||
      !bathroom ||
      !latitude ||
      !longitude ||
      !type ||
      !property
    ) {
      return res.json({
        success: false,
        message: "Please provide all required fields",
      })
    }

    let uploadedImages = []

    for (const image of images) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "postImages",
      })

      uploadedImages.push(uploadResponse.secure_url)
    }

    const post = await prisma.post.create({
      data: {
        title,
        price: Number(price),
        images: uploadedImages,
        address,
        city,
        bedroom,
        bathroom,
        latitude,
        longitude,
        type,
        property,
        userId,
        PostDetail: postDetail      
          ? {
              create: {
                desc: postDetail.desc,
                utilities: postDetail.utilities,
                pet: postDetail.pet,
                income: postDetail.income,
                size: postDetail.size ? Number(postDetail.size) : null,
                school: postDetail.school ? Number(postDetail.school) : null,
                bus: postDetail.bus ? Number(postDetail.bus) : null,
                restaurant: postDetail.restaurant
                  ? Number(postDetail.restaurant)
                  : null,
              },
            }
          : undefined,
      },
      include: {
        PostDetail: true,
      },
    })

    return res.json({
      success: true,
      message: "Post created successfully",
      post,
    })
  } catch (err) {
    return res.json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    })
  }
}

export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            userName: true,
            email: true,
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return res.json({
      success: true,
      posts,
    })
  } catch (err) {
    return res.json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    })
  }
}

export const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            userName: true,
            email: true,
            profile: true,
          },
        },
        PostDetail: true,
      },
    })

    if (!post) {
      return res.json({
        success: false,
        message: "Post not found",
      })
    }

    return res.json({
      success: true,
      post,
    })
  } catch (err) {
    return res.json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    })
  }
}

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.userId

    const posts = await prisma.post.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return res.json({
      success: true,
      posts,
    })
  } catch (err) {
    return res.json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    })
  }
}

export const deletePost = async (req, res) => {
  try {
    const userId = req.userId
    const { id } = req.params

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    })

    if (!post) {
      return res.json({
        success: false,
        message: "Post not found",
      })
    }

    if (post.userId !== userId) {
      return res.json({
        success: false,
        message: "Unauthorized",
      })
    }

    await prisma.postDetail.delete({
      where: { postId: id },
    })

    await prisma.post.delete({
      where: {
        id,
      },
    })

    return res.json({
      success: true,
      message: "Post deleted successfully",
    })
  } catch (err) {
    return res.json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    })
  }
}

export const updatePost = async (req, res) => {
  try {
    const userId = req.userId
    const { id } = req.params

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    })

    if (!post) {
      return res.json({
        success: false,
        message: "Post not found",
      })
    }

    if (post.userId !== userId) {
      return res.json({
        success: false,
        message: "Unauthorized",
      })
    }

    const {
      title,
      price,
      address,
      city,
      bedroom,
      bathroom,
      latitude,
      longitude,
      type,
      property,
      postDetail,
    } = req.body

    let updateData = {}

    if (title) updateData.title = title
    if (price) updateData.price = Number(price)
    if (address) updateData.address = address
    if (city) updateData.city = city
    if (bedroom) updateData.bedroom = bedroom
    if (bathroom) updateData.bathroom = bathroom
    if (latitude) updateData.latitude = latitude
    if (longitude) updateData.longitude = longitude
    if (type) updateData.type = type
    if (property) updateData.property = property
    if (postDetail) {
      updateData.PostDetail = {
        update: {
          desc: postDetail.desc,
          utilities: postDetail.utilities,
          pet: postDetail.pet,
          income: postDetail.income,
          size: postDetail.size ? Number(postDetail.size) : null,
          school: postDetail.school ? Number(postDetail.school) : null,
          bus: postDetail.bus ? Number(postDetail.bus) : null,
          restaurant: postDetail.restaurant
            ? Number(postDetail.restaurant)
            : null,
        },
      }
    }
    const updatedPost = await prisma.post.update({
      where: {
        id,
      },
      data: updateData,
    })

    return res.json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    })
  } catch (err) {
    return res.json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    })
  }
}

export const getFilteredPosts = async (req, res) => {
  try {
    const { city, type, property, minPrice, maxPrice, bedroom } = req.query

    const filters = {}

    if (city) filters.city = { contains: city, mode: "insensitive" }
    if (type && type !== "any") filters.type = type.toLowerCase()
    if (property && property !== "any") filters.property = property.toLowerCase()
    if (bedroom) filters.bedroom = bedroom
    if (minPrice || maxPrice) {
      filters.price = {}
      if (minPrice) filters.price.gte = Number(minPrice)
      if (maxPrice) filters.price.lte = Number(maxPrice)
    }

    const posts = await prisma.post.findMany({
      where: filters,
      include: {
        user: {
          select: {
            id: true,
            userName: true,
            email: true,
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return res.json({
      success: true,
      posts,
    })
  } catch (err) {
    return res.json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    })
  }
}