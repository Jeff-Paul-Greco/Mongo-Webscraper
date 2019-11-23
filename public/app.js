
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