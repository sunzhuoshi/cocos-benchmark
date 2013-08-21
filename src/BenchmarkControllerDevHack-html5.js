/**
 * Created with JetBrains PhpStorm.
 * User: sunzhuoshi
 * Date: 2/25/13
 * Time: 11:51 AM
 */
var BENCHMARK_TIMES = 10;

(function() {
    var controller = BenchmarkController.getInstance();
    var getStatisticalDispersion = function(dataArray) {
        var i, sum = 0, average, standardDeviation;
        for (i=0; i<dataArray.length; ++i) {
            sum += dataArray[i];
        }
        average = sum / dataArray.length;
        sum = 0;
        for (i=0; i<dataArray.length; ++i) {
            sum += (dataArray[i] - average) * (dataArray[i] - average);
        }
        standardDeviation = Math.sqrt(sum / dataArray.length);
        return {
            average: average,
            standardDeviation: standardDeviation
        }
    };
    controller._benchmarkTime_ = 0;
    controller._benchmarkScores_ = [];
    controller._reset_ = function() {
        this._benchmarkTime_ = 0;
        this._benchmarkScores_ = [];
    };
    controller._outputTestResult_ = function() {
        var finalScores = [];
        var testScores = [];
        var i, j;
        for (i=0; i<this._benchmarkScores_.length; ++i) {
            finalScores[i] = this._benchmarkScores_[i].finalScore;
        }
        for (j=0; j<this._benchmarkScores_[0].testScores.length; ++j) {
            testScores[j] = [];
            for (i=0; i<this._benchmarkScores_.length; ++i) {
                testScores[j][i] = this._benchmarkScores_[i].testScores[j];
            }
        }
        BenchmarkOutput.getInstance().clear();
        for (j=0; j<testScores.length; ++j) {
            var testScoreStatisticalDispersion = getStatisticalDispersion(testScores[j]);
            BenchmarkOutput.getInstance().writeln(BenchmarkTestCases.get(j).name, '%25', testScoreStatisticalDispersion.average.toFixed(2),
                ' +/- ' + (testScoreStatisticalDispersion.standardDeviation / testScoreStatisticalDispersion.average * 100).toFixed(1) + '%');
        }
        finalScoreStatisticalDispersion = getStatisticalDispersion(finalScores);
        BenchmarkOutput.getInstance().writeln('Score:', '%25', finalScoreStatisticalDispersion.average.toFixed(2),
            ' +/- ' + (finalScoreStatisticalDispersion.standardDeviation / finalScoreStatisticalDispersion.average * 100).toFixed(1) + '%');
        BenchmarkOutput.getInstance().writeln('####################################')
        BenchmarkOutput.getInstance().writeln('Reference values:');
        for (j=0; j<testScores.length; ++j) {
            var testInfo = BenchmarkTestCases.get(j);
            var testScoreStatisticalDispersion = getStatisticalDispersion(testScores[j]);
            BenchmarkOutput.getInstance().writeln(testInfo.name + ':', '%25',  'FPS=', (testInfo.referenceFPS * testScoreStatisticalDispersion.average).toFixed(2));
        }
    };
    controller._oldBenchmarkDone_ = controller.benchmarkDone;
    controller.benchmarkDone = function() {
        this._oldBenchmarkDone_();
        var benchmarkScore = {
            testScores: [],
            finalScore: this.getFinalScore()
        };
        var i;
        for (i=0; i<this._testScores.length; ++i) {
            benchmarkScore.testScores[i] = Number(this._testScores[i]);
        }
        this._benchmarkScores_[this._benchmarkTime_] = benchmarkScore;
        this._benchmarkTime_ ++;
        if (this._benchmarkTime_ === BENCHMARK_TIMES) {
            this._outputTestResult_();
            this._reset_();
        }
        else {
            BenchmarkOutput.getInstance().writeln("<<<<<<<<<<<<<<<< " + this._benchmarkTime_ + " >>>>>>>>>>>>>>>>");
            this.startBenchmark();
        }
    };
    // update version info when run dev version with SINGLE_FILE off
    var benchmarkVersionElement = document.getElementById('benchmark_version');
    if (benchmarkVersionElement) {
        if (-1 === BENCHMARK_VERSION.indexOf('dev')) {
            benchmarkVersionElement.innerHTML = BENCHMARK_VERSION + '-dev';
        }
    }
})();

