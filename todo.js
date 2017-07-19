        var todoList = []
        var len = todoList.length
        // console.log('1', len);
        // 给add绑定click事件
        var bindEventAdd = function() {
        $('.input-todo-add').on('click', function() {
            AddNewTodo()
        })
        }

        // 给enter绑定keydown事件， 实现点击Enter后add新添加的todo
        var bindEventInputKeydown = function() {
        $('#id-todo-input').on('keydown', function(event) {
            // 判断如果点击的是Enter键，则提交添加的todo.
            // console.log('event.key', event.key);
            if (event.key === 'Enter') {
                AddNewTodo()
            }
        })
        }

        //给完成、删除、编辑添加click事件，但由于完成按钮是后面添加的，不能提前给不存在的元素绑定事件
        // 所以此处绑定到父元素，利用事件冒泡的机制
        var bindEventbutton = function() {
        $('.todo-containner').on('click', function(event) {
            // 打印出点击的目标
            var target = $(event.target)
            // console.log('target', target);
            // 目标的父元素
            var parent = target.closest('.todo-cell-todo')
            console.log('parent', parent);
            var todo = todoList[targetButton(parent)]
            // console.log('todo', todo);
            // 如果点击的是完成按钮，
            // 如果target的父元素而非父元素本身含有'todo-cell-todo'，说明点击的是完成按钮。
            if (target.hasClass('todo-complete-button') === true) {
                // 当点击完成按钮以后，如果按钮的父元素有class = done ,说明改按钮已经被点击过，
                // 那么再次点击的时候，去掉done
                if (parent.hasClass('done') === true) {
                    parent.removeClass(`${todo.done}`)
                    todo.done = 'none'
                }else {
                    todo.done = 'done'
                    parent.addClass(`${todo.done}`)
                }
                saveTodos(todoList)
                // console.log('t', todoList[0]);
            }
            // 如果点击的是删除按钮，将其父元素删除并将本地存储的todoList中对应的todo删除，
            else if (target.hasClass('todo-delete-button') === true) {
                var parent = target.closest('.todo-cell-todo')
                parent.remove()
                var index = targetButton(parent)
                todoList.splice(index, 1)
                saveTodos(todoList)
            }
            // 如果点击的是编辑按钮，使输入框编程可编辑状态，并聚焦到input
            else if (target.hasClass('todo-edit-button') === true) {
                // 目标的父元素
                console.log('target', target);
                var parent = target.closest('.todo-cell-todo')
                console.log('parent', parent);
                var spanTodo = $(parent.children()[1])
                // console.log('spanTodo',spanTodo);
                spanTodo.attr('contenteditable', true)
                spanTodo.focus()
            }
        })

        }

        // todo.task的失焦事件
        var bindEventblur = function() {
        var todoContainner = document.querySelector('.todo-containner')
        todoContainner.addEventListener('blur', function(event) {
            var target = event.target
            // console.log('target3', event.target);
            if (target.classList.contains('todo-task')) {
                target.setAttribute('contenteditable', false)
                // var todoCell = document.querySelector('.todo-cell-todo')
                // console.log('todocell', todoCell);
                var index = indexOfElement(target)
                // console.log('index', index);
                todoList[index].task = target.innerHTML
                saveTodos(todoList)
            }
        },true)
        }

        //阻止Enter默认行为的发生，实现回车即保存新添加的todo
        var bindEventPreventDefault = function() {
        $('.todo-containner').on('keydown', function(event) {
            var target = $(event.target)
            // console.log('target3', target);
            if (event.key == 'Enter') {
                // console.log('回车');
                target.blur()
                // 阻止默认行为的发生，也就是不插入回车
                event.preventDefault()
                // console.log('target7', target);
                var index = indexOfElement(target[0])
                // console.log('index2', index);
                todoList[index].task = target[0].innerHTML
                // console.log('todolist5',todoList );
                saveTodos(todoList)
            }
        })

        }

        // 添加todo
        var AddNewTodo = function() {
        var todoValue = $('#id-todo-input')[0].value
        // console.log('value',todoValue)
        var todo = {
            'task': todoValue,
            'id': len++,
            'timeY': formtimeY(),
            'timeD': formtimeD(),
            'done': 'none',
        }
        todoList.push(todo)
        saveTodos(todoList)
        insertTodo(todo)
        $('#id-todo-input')[0].value = ''
        }

        // 在todo容器中添加todoListist
        var insertTodo = function(todo) {
        $('.todo-containner').append(template(todo))
        }
        // 模板字符串
        var template = function(todo) {
        // console.log('todo', todo);
        var t = `
        <div class="row">
            <div class="col-md-2">
            </div>
            <div class="col-md-8">
                <div class="todo-cell-todo ${todo.done} list-group-item row" data-index=${todo.id}>
                    <div class="col-md-2">
                        <div currentTimeY>${todo.timeY}</div>
                    </div>
                    <div class="col-md-6 yy">
                        <span class="todo-task">${todo.task}</span>
                    </div>
                    <div class="col-md-4 row">
                        <div class="col-md-2">
                            <span currentTimeD>${todo.timeD}</span>
                        </div>
                        <div class="col-md-10">
                            <div class="btn-group" role="group" aria-label="...">
                                <button class="todo-edit-button btn btn-default btn-lg" type="buttbtn-defaulton" name="button">
                                    <span class="todo-edit-button glyphicon glyphicon-pencil" aria-hidden="true" aria-label="add"></span>
                                </button>
                                <button class="todo-delete-button btn btn-default btn-lg" type="button" name="button">
                                    <span class="todo-delete-button glyphicon glyphicon-trash" aria-hidden="true" aria-label="delete"></span>
                                </button>
                                <button class="todo-complete-button btn btn-default btn-lg" type="button" name="button">
                                    <span class="todo-complete-button glyphicon glyphicon-ok" aria-hidden="true" aria-label="complete"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
        // console.log('t', t);
        return t
    }

        // jequery，找出点击的按钮父元素中id对应的todolist的todo
        var targetButton = function(parent) {
        // 父元素的带得id
        var dataId = parent.data('index')
        // console.log('dataId', dataId);
        // 如果所点击的按钮的父元素的id等于todolist中id，那么todo = todoList[i],
        for (var i = 0; i < todoList.length; i++) {
            var todoId = todoList[i].id
            if (todoId === dataId) {
                return i
            }
        }
    }

        // 原生，找出点击的按钮父元素中id对应的todolist的todo
        var indexOfElement = function(element) {
        var parent = element.parentElement
        // console.log('parent2', parent);
        // 父元素的带得id
        var dataId = Number(parent.dataset.index)
        // console.log('dataId', dataId, typeof dataId);
        for (var i = 0; i < todoList.length; i++) {
            var todoId = todoList[i].id
            // console.log('todoid', todoId, typeof todoId);
            if (todoId === dataId) {
                return i
            }
        }
    }
        // 格式化时间
        var formtimeY = function() {
        //  获取当前系统的日期
         var d = new Date()
        //  var year = d.getFullYear()
         var month = d.getMonth() + 1
         var date = d.getDate()
        //  var hours = d.getHours()
        //  var minutes = d.getMinutes()
        //  var seconds = d.getSeconds()
        //  console.log('year', typeof year);
         var a = [month, date]
         var b = []
         for (var i = 0; i < a.length; i++) {
             if (a[i] < 10) {
                  a[i] = `0${a[i]}`
             }
             b.push(a[i])
         }
         var stringtime = `${a[0]}月${a[1]}日`
        //  console.log('stringtime', stringtime);
        return stringtime
    }

        var formtimeD = function() {
        //  获取当前系统的日期
         var d = new Date()
        //  var year = d.getFullYear()
        //  var month = d.getMonth() + 1
        //  var date = d.getDate()
         var hours = d.getHours()
         var minutes = d.getMinutes()
        //  var seconds = d.getSeconds()
        //  console.log('year', typeof year);
         var a = [hours, minutes]
         var b = []
         for (var i = 0; i < a.length; i++) {
             if (a[i] < 10) {
                  a[i] = `0${a[i]}`
             }
             b.push(a[i])
         }
         var stringtime = `${a[0]}:${a[1]}`
        //  console.log('stringtime', stringtime);
        return stringtime
    }
        // 序列化
        var saveTodos = function(todoList) {
        //  console.log('todoList', todoList);
         var s = JSON.stringify(todoList)
         localStorage.todoList = s
        }
        //  反序列化
        var loadTodos = function() {
         var s = localStorage.todoList
         if (s !== undefined ) {
            return JSON.parse(s)
        }else {
            return []
        }
    }

        var bindEvents = function() {
         bindEventPreventDefault()
         bindEventblur()
         bindEventbutton()
         bindEventInputKeydown()
         bindEventAdd()
    }

        //  刷新页面时，将存放在本地的todoList中todo遍历,insert到页面
        var initTodos = function() {
          todoList = loadTodos()
          for (var i = 0; i < todoList.length; i++) {
              var todo = todoList[i]
              insertTodo(todo)
        }
    }


        var __main = function() {
         bindEvents()
         initTodos()
        }
        __main()
