import * as tslib_1 from "tslib";
import { AbstractSqliteDriver } from "../sqlite-abstract/AbstractSqliteDriver";
import { ExpoQueryRunner } from "./ExpoQueryRunner";
import { DriverOptionNotSetError } from "../../error/DriverOptionNotSetError";
import { DriverPackageNotInstalledError } from "../../error/DriverPackageNotInstalledError";
var ExpoDriver = /** @class */ (function (_super) {
    tslib_1.__extends(ExpoDriver, _super);
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function ExpoDriver(connection) {
        var _this = _super.call(this, connection) || this;
        _this.database = _this.options.database;
        // validate options to make sure everything is set
        if (!_this.options.database)
            throw new DriverOptionNotSetError("database");
        // load sqlite package
        _this.loadDependencies();
        return _this;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Closes connection with database.
     */
    ExpoDriver.prototype.disconnect = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (ok, fail) {
                        try {
                            _this.queryRunner = undefined;
                            _this.databaseConnection = undefined;
                            ok();
                        }
                        catch (error) {
                            fail(error);
                        }
                    })];
            });
        });
    };
    /**
     * Creates a query runner used to execute database queries.
     */
    ExpoDriver.prototype.createQueryRunner = function (mode) {
        if (mode === void 0) { mode = "master"; }
        if (!this.queryRunner)
            this.queryRunner = new ExpoQueryRunner(this);
        return this.queryRunner;
    };
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Creates connection with the database.
     */
    ExpoDriver.prototype.createDatabaseConnection = function () {
        var _this = this;
        return new Promise(function (ok, fail) {
            try {
                var databaseConnection_1 = _this.sqlite.openDatabase(_this.options.database);
                /*
                // we need to enable foreign keys in sqlite to make sure all foreign key related features
                // working properly. this also makes onDelete work with sqlite.
                */
                databaseConnection_1.transaction(function (tsx) {
                    tsx.executeSql("PRAGMA foreign_keys = ON;", [], function (t, result) {
                        ok(databaseConnection_1);
                    }, function (t, err) {
                        fail({ transaction: t, error: err });
                    });
                }, function (err) {
                    fail(err);
                });
            }
            catch (error) {
                fail(error);
            }
        });
    };
    /**
     * If driver dependency is not given explicitly, then try to load it via "require".
     */
    ExpoDriver.prototype.loadDependencies = function () {
        try {
            this.sqlite = window.Expo.SQLite;
        }
        catch (e) {
            throw new DriverPackageNotInstalledError("Expo", "expo");
        }
    };
    return ExpoDriver;
}(AbstractSqliteDriver));
export { ExpoDriver };

//# sourceMappingURL=ExpoDriver.js.map
