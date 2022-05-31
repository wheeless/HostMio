const fileField = document.querySelector('input[type="file"]');
const downloadable = document.querySelector('#downloadable');
const myForm = document.getElementById('myForm');
//formData.append('avatar', fileField.files[0]);

myForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('avatar', fileField.files[0]);

  if (downloadable.checked) {
    formData.append('downloadable', 'true');
  } else {
    formData.append('downloadable', 'false');
  }

  fetch('/api/files/upload', {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.json())
    .then(
      (data) =>
        (document.getElementById('response').innerHTML = [
          `File Uploaded! Name: ${data.data.name}, Type: ${data.data.mimetype}, Size: ${data.data.size}, Downloadable: ${data.downloadable}. Link: ${data.data.url}`,
        ]) && console.log('Success:', data)
    )
    .catch((err) => console.error(err));

  myForm.reset();
});
