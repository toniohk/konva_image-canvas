const stage = new Konva.Stage({
  container: 'container',
  width: window.innerWidth,
  height: window.innerHeight,
});

const layer = new Konva.Layer();
stage.add(layer);

const removeTransformer = () => {
  layer.find('Transformer').map(item => item.hide());
};

const openFile = () => {
  document.getElementById('fileReader').click();
};

const readFile = (e) => {
  for (let i = 0; i < e.target.files.length; i++) {
    const URL = window.webkitURL || window.URL;
    const url = URL.createObjectURL(e.target.files[i]);
    let img = new Image();
    img.src = url;

    img.onload = function () {
      let theImg = new Konva.Image({
        image: img,
        x: (window.innerWidth - img.width) / 2 + i * 30,
        y: (window.innerHeight - img.height) / 2 + i * 10,
        draggable: true,
      });

      layer.add(theImg);

      // Add Transformer
      let tr = new Konva.Transformer({
        nodes: [theImg],
        keepRatio: false,
        boundBoxFunc: (oldBox, newBox) => {
          if (newBox.width < 10 || newBox.height < 10) {
            return oldBox;
          }
          return newBox;
        },
      });

      layer.add(tr);
      const deleteButton = new Konva.Circle({
        radius: 8,
        fill: 'red'
      });

      tr.add(deleteButton);
      tr.hide();

      function updatePos() {
        deleteButton.position(tr.findOne('.top-right').position());
      }

      updatePos();

      theImg.on('transform', updatePos);

      theImg.on('mousedown', () => {
        setTimeout(() => {
          tr.show();
        }, 1);
      });

      deleteButton.on('mousedown', () => {
        theImg.remove();
      });
    }
  }
};

const save = () => {
  let link = document.createElement('a');
  link.download = 'download.png';
  link.href = stage.toDataURL({ pixelRatio: 3 });;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
};

stage.addEventListener('mousedown', removeTransformer);
document.getElementById('addImages').addEventListener('click', openFile);
document.getElementById('fileReader').addEventListener('change', readFile);
document.getElementById('save').addEventListener('click', save);