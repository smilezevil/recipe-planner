export function resizeImage(file: File, maxSize = 800, quality = 0.8): Promise<string> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file)
        const image = new Image()

        image.onload = () => {
            URL.revokeObjectURL(url)

            const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
            const canvas = document.createElement('canvas')
            canvas.width = Math.round(image.width * scale)
            canvas.height = Math.round(image.height * scale)

            const context = canvas.getContext('2d')

            if (!context) {
                reject(new Error('Браузер не може обробити зображення'))
                return
            }

            context.fillStyle = '#ffffff'
            context.fillRect(0, 0, canvas.width, canvas.height)
            context.drawImage(image, 0, 0, canvas.width, canvas.height)
            resolve(canvas.toDataURL('image/jpeg', quality))
        }

        image.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error('Не вдалося прочитати зображення'))
        }

        image.src = url
    })
}