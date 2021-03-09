/* eslint-disable no-undef */
function getWpMedia() {
  wp.media.frames.file_name = wp.media({
    title: 'Choose a Picture',
    button: { text: 'Choose Picture' },
    multiple: false,
  });
  return wp.media.frames.file_name;
}

export default getWpMedia;
