const { shell } = require("electron")

const sharp = require("sharp")

// 仅对宽度大于500px的图片进行缩小并保持纵横比的函数
async function resizeBase64ImageIfNeeded(base64, maxWidth) {
  const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64")

  // 使用sharp库处理图像
  const metadata = await sharp(buffer).metadata()

  // 如果宽度小于等于指定的maxWidth，保持原始尺寸
  if (metadata.width <= maxWidth) {
    // return base64
  }

  // 计算新的宽度和高度，保持纵横比
  const aspectRatio = metadata.width / metadata.height
  const newWidth = maxWidth
  const newHeight = Math.round(newWidth / aspectRatio)

  // 使用sharp库进行缩小
  const resizedBuffer = await sharp(buffer).resize(12, 12).toBuffer()
  const resizedBase64 = `data:image/png;base64,${resizedBuffer.toString("base64")}`

  return resizedBase64
}

window.exports = {
  screen_capture: {
    // 注意：键对应的是 plugin.json 中的 features.code
    mode: "none", // 用于无需 UI 显示，执行一些简单的代码
    args: {
      enter: (action, callbackSetList) => {
        window.utools.hideMainWindow()
        utools.screenCapture((base64Str) => {
          // 调用函数进行缩小宽度大于500px并保持纵横比
          const maxWidth = 50
          resizeBase64ImageIfNeeded(base64Str, maxWidth)
            .then((resizedBase64) => {
              utools.copyImage("data:image/png;base64," + resizedBase64)
            })
            .catch((error) => {
              console.error("Error:", error)
            })
        })
        window.utools.outPlugin()
      }
    }
  }
}
