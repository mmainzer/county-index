let score;

$(document).ready(function() {
    $('.single-select').select2();

    $("#scoreSubmit").click(function(){
        score = ( ( $('#econRange').val() * 0.3 ) + ( $('#eduRange').val() * 0.3 ) + ( $('#healthRange').val() * 0.2 ) + ( $('#oppRange').val() * 0.2 ) );
		score = score.toFixed(1);
        $('#guessScoreLabel').text(score);
        let county = $("#select2-fill-select-container").text();
        let actual = scoresObj[county].Composite;
        let difference = ( actual - score ).toFixed(1);
        
        if (difference > 0 ) {
        	$("#scorePlace").text("underestimated");
        } else if (difference < 0 ) {
        	$("#scorePlace").text("overestimated");
        } else {
        	$("#scoreExplain").text("You got it exactly right!");
        }

        $("#differenceLabel").text(Math.abs( difference ) + " points");
        $('#actualScoreLabel').text(actual);
        $('.results-container').show();
        $('.table-container').show();
        $('.tableau-container').css("opacity",1);
    }); 
});

$('#econRange').on('input', function(){
    $('#econVal').text($('#econRange').val());
});

$('#eduRange').on('input', function(){
    $('#eduVal').text($('#eduRange').val());
});

$('#healthRange').on('input', function(){
    $('#healthVal').text($('#healthRange').val());
});

$('#oppRange').on('input', function(){
    $('#oppVal').text($('#oppRange').val());
});

