
$(document).on("click", ".comment-btn", function () {
    $('.modal').modal();
    $('.modal').modal('open');
    $(".modal-content").empty();
    var id = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + id
    })

        .then(function (data) {

            for (i = 0; i < data.comment.length; i++) {
                $(".modal-content").append("<p>" + data.comment[i] + "</p>" + "<button class='btn btn-medium delete-comment' data-id='" + data.comment[i] + "'>Delete</button>")
                console.log(data.comment[i])
            }
            

            $(".modal-content").append("<h6>" + data.title + "</h6>");

            $(".modal-content").append("<p>New Comment</p>");

            $(".modal-content").append("<textarea id='bodyinput' name='body'></textarea>");

            $(".modal-content").append("<button class='btn btn-medium' data-id='" + data._id + "' id='save-comment'>Post</button>");

        });
});

$(document).on("click", '.delete-comment', function (id) {
    console.log("working")
    console.log($(this).attr("data-id"))
    id = $(this).attr("data-id")
    console.log(id)
    $.ajax({
        url: "deletecomment/" + id,
        type: "DELETE"
    })
        .then(function (data) {

        });
    $('.modal').modal('close');

})

$(document).on("click", "#save-comment", function () {

    var id = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: {

            body: $("#bodyinput").val()
        }
    })

        .then(function (data) {

        });

    $("#bodyinput").val("");
    $('.modal').modal('close');
});

$(".save-article-btn").on("click", function (id) {
    console.log($(this).attr("data-id"))
    id = $(this).attr("data-id")
    console.log(id)
    $.ajax({
        url: "saved/" + id,
        type: "PUT"
    });
    location.reload();

})

$(".delete-article-btn").on("click", function (id) {
    console.log($(this).attr("data-id"))
    id = $(this).attr("data-id")
    console.log(id)
    $.ajax({
        url: "delete/" + id,
        type: "DELETE"
    });
    location.reload();

})

