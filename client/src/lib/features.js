import moment from "moment";

const fileformat = (url = "") => {
    const fileExt = url.split('.').pop().toLowerCase();

    let format = 'file';
    switch (fileExt) {
        case 'mp4':
        case 'webm':
        case 'ogg':
            format = 'video';
            break;

        case 'mp3':
        case 'wav':
            format = 'audio';
            break;

        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            format = 'image';
            break;
    }
    return format;
};

// https://res.cloudinary.com/demo/w_512,dpr_auto/bike.jpg

const transformImage = (url = "", width = 100) =>
    url.replace("upload/", `upload/w_${width},dpr_auto/`);

const getLastSevenDays = () => {
    const currDate = moment();
    const lastSevenDays = [];
    for (let i = 0; i < 7; i++) {
        const dayDate = currDate.clone().subtract(i, 'days');
        const dayName = dayDate.format('dddd');
        lastSevenDays.unshift(dayName)

    }
    return lastSevenDays;
}

export {
    fileformat,
    transformImage,
    getLastSevenDays
}