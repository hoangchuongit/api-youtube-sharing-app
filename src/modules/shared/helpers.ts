export const validateYouTubeUrl = (link: string) => {
  if (link != undefined || link != '') {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    const match = link.match(regExp);
    if (match && match[2].length == 11) {
      return true;
    }

    return false;
  }
};
