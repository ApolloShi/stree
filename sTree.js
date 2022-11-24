function sTree(objName, checkbox = false, imgUrl = "./assets/img") {
  this.icon = {
    root: imgUrl + "/base.gif",
    folder: imgUrl + "/folder.gif",
    folderOpen: imgUrl + "/folderopen.gif",
    node: imgUrl + "/page.gif",
    noLinesPlus: imgUrl + "/nolinesPlus.gif",
    noLinesMinus: imgUrl + "/nolinesMinus.gif"
  };
  this.obj = objName;
  this.selectedNode = null;
  this.checkbox = checkbox; // 是否多选
  this.id = 1;
  this.pid = 0;
  this.aNodes = [];
  this.nodes = [];
  this.aNodesObj = {};
  // 指定接口数据名称后期如有需要在拓展
  // this.file_lists = "file_lists";
  // this.path = "path";
}
// 传入数据
sTree.prototype.append = function (treeData, name) {
  // 数据转换
  console.log("后台传递过来的数据：", treeData);
  var data = treeData.file_lists;
  var path = treeData.path;
  for (var i = 0; i < data.length; i++) {
    this.add(data[i].name, data[i].type, path);
    this.id++;
  }
  console.log(this);
  var addNodeStr = this.addNode();
  // console.log("addNodeStr", addNodeStr);
  $("#" + name).append(addNodeStr);
};

function Node(id, pid, name, type, path) {
  this.id = id;
  this.pid = pid;
  this.name = name;
  this.type = type;
  if (path === "/") {
    this.path = name;
  } else if (path.slice(-1) === "\\") {
    this.path = path + name;
  } else {
    this.path = path + "\\" + name;
  }
}

// 添加数据
sTree.prototype.add = function (name, type, path) {
  this.aNodes[this.aNodes.length] = new Node(this.id, this.pid, name, type, path);
  this.nodes[this.nodes.length] = new Node(this.id, this.pid, name, type, path);
  this.aNodesObj[this.id] = new Node(this.id, this.pid, name, type, path);
};

// 生成DOM
sTree.prototype.addNode = function () {
  var str = "";
  var n = 0;
  for (n; n < this.nodes.length; n++) {
    str += this.node(this.nodes[n]);
  }
  return str;
};

// 生成dom方法
sTree.prototype.node = function (node) {
  var str = "";
  str += '<div id="s' + node.id + '" class="clip" style="display: block">';
  str += '<div id="d' + node.id + '" class="sTreeNode" onclick="s(' + node.id + '); ">';
  if (node.type === "dir") {
    str += '<img id="j' + node.id + '"src="' + this.icon.folder + '" alt="" />';
  } else {
    str += '<img id="j' + node.id + '" src="' + this.icon.node + '" alt="" />';
  }
  if (this.checkbox) {
    str +=
      '<input  type="checkbox" name="checkBox" class="checkBox" value="' +
      node.path +
      '"id="i' +
      node.id +
      '"onchange="getCheckBox(this);"/>';
  }
  str += '<p  class="node" >' + node.name + "</p>";
  str += "</div>";
  str += "</div>";
  return str;
};
// 没有子元素的选中
sTree.prototype.getSelected = function (data) {
  // 先取消掉上一个在进行选择
  if (this.selectedNode || this.selectedNode == 0) {
    var eOld = document.getElementById("d" + this.selectedNode);
    eOld.className = "sTreeNode";
  }
  var pNode = document.getElementById("d" + data.id);
  pNode.className = "nodeSel";
  this.selectedNode = data.id;
};
// 有子菜单的方法
sTree.prototype.getDirSelected = function (data, ajaxData) {
  this.pid = data.id;
  this.getSelected(data);
  var childNodes = document.getElementById("s" + data.id).childNodes;
  var img = document.getElementById("j" + data.id);

  if (childNodes.length === 1) {
    //  ajaxData 后续换乘ajax的真实数据
    // 清空已有的nodes
    this.nodes = [];
    // 获取子集数据
    this.append(ajaxData, "s" + data.id);
    // 更改文件夹的样式;
    img.src = this.icon.folderOpen;
  } else {
    if (childNodes[1].style.display === "block") {
      img.src = this.icon.folder;
      for (var i = 1; i < childNodes.length; i++) {
        childNodes[i].style.display = "none";
      }
    } else {
      img.src = this.icon.folderOpen;
      for (var i = 1; i < childNodes.length; i++) {
        childNodes[i].style.display = "block";
      }
    }
  }
};
// // 多选的值
// function getCheckBox(event) {
//   var chk_value = []; //定义一个数组
//   $('input[name="checkBox"]:checked').each(function () {
//     //遍历每一个名字为nodes的复选框，其中选中的执行函数
//     chk_value.push($(this).val()); //将选中的值添加到数组chk_value中
//   });
//   console.log("chk_value", chk_value);
// }

// // 单选的方法
// function s(id) {
//   var that = sTree;
//   console.log("id", id, that.aNodesObj[id]);
//   if (that.selectedNode != id) {
//     // 如果是文件夹就先查看是否加载过,没有加载的话就加载,有的话就切换开关
//     if (that.aNodesObj[id].type === "dir") {
//       getDirSelected(that.aNodesObj[id], that, ajax(id));
//     } else {
//       // 如果是文件就直接选中
//       that.getSelected(that.aNodesObj[id]);
//     }
//   } else {
//     if (that.aNodesObj[id].type === "dir") {
//       getDirSelected(that.aNodesObj[id], that, ajax(id));
//     }
//   }
// }
