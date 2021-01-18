define([
    'jquery',
    '/common/hyperscript.js',
    '/customize/messages.js',
    '/customize/application_config.js',
    '/common/outer/local-store.js',
    '/customize/pages.js',
    '/api/config',
], function ($, h, Msg, AppConfig, LocalStore, Pages, Config) {
    var origin = encodeURIComponent(window.location.hostname);
    var accounts = {
        donateURL: AppConfig.donateURL || "https://opencollective.com/cryptpad/",
        upgradeURL: AppConfig.upgradeURL || 'https://accounts.cryptpad.fr/#/?on=' + origin,
    };

    // XXX translations
    Msg.features_title = "Features";

    return function () {
        // Non-registered column
        Msg.features_anon = "Non-registered";
        Msg.features_f_apps = "Access to all the applications";
        // Msg.features_f_apps_note = "";
        Msg.features_f_core = "Common features";
        // Msg.features_f_core_note = "";
        Msg.features_f_file0 = "Open documents";
        Msg.features_f_file0_note = "View and download documents shared by other users";
        // Msg.features_f_cryptdrive0 = "";
        // Msg.features_f_cryptdrive0_note = "";
        // Msg.features_f_storage0 = "";
        Msg.features_f_storage0_note = "Documents are deleted after {0} days of inactivity";
        // Registered column
        Msg.features_registered = "Registered"; //
        // Msg.features_f_anon = "";
        Msg.features_f_anon_note = "With additional functionality";
        Msg.features_f_social = "Social Features";
        Msg.features_f_social_note = "Add contacts for secure collaboration, create a profile, fine-grained access controls";
        // Msg.features_f_file1 = "";
        Msg.features_f_file1_note = "Store files in your CryptDrive: images, PDFs, videos, and more. Share them with your contacts or embed them in your documents. (up to {0}MB)";
        // Msg.features_f_cryptdrive1 = "";
        // Msg.features_f_cryptdrive1_note = "";
        // Msg.features_f_devices = "";
        // Msg.features_f_devices_note = "";
        Msg.features_f_storage1 = "Permanent Storage ({0}GB)";
        Msg.features_f_storage1_note = "Documents stored in your CryptDrive are never deleted for inactivity";
        // Premium column
        Msg.features_premium = "Premium";
        Msg.features_pricing = "{0} to {2}€ per month";
        // Msg.features_f_reg = ""
        Msg.features_f_reg_note = "With additional benefits";
        // Msg.features_f_storage2 = ""
        Msg.features_f_storage2_note = "From 5GB to 50GB depending on the plan. Increased limit of {0}MB for file uploads.";
        // Msg.features_f_support = ""
        Msg.features_f_support_note = "Priority response from the administration team via email and built in ticket system.";
        Msg.features_f_supporter = "Support privacy";
        Msg.features_f_supporter_note = "Help CryptPad financially sustainable and show that privacy-enhancing software willingly funded by users should be the norm";
        Msg.features_f_subscribe = "Subscribe";
        Msg.features_f_subscribe_note = "Registered account needed to subscribe";

        Msg.features_f_apps_note = AppConfig.availablePadTypes.map(function (app) {
            if (AppConfig.registeredOnlyTypes.indexOf(app) !== -1) { return; }
            return Msg.type[app];
        }).filter(function (x) { return x; }).join(', ');
        var premiumButton = h('a', {
            href: accounts.upgradeURL,
            target: '_blank',
            rel: 'noopener noreferrer'
        }, h('button.cp-features-register-button', Msg.features_f_subscribe));

        var groupItemTemplate = function (title, content) {
            return h('li.list-group-item', [
                h('div.cp-check'),
                h('div.cp-content', [
                    h('div.cp-feature', title),
                    h('div.cp-note', content),
                ])
            ]);
        };

        var defaultGroupItem = function (key) {
            return groupItemTemplate(
                Msg['features_f_' + key],
                Msg['features_f_' + key + '_note']
            );
        };

        var SPECIAL_GROUP_ITEMS = {};
        SPECIAL_GROUP_ITEMS.storage0 = function (f) {
            return groupItemTemplate(
                Msg['features_f_' + f],
                Msg._getKey('features_f_' + f + '_note', [Config.inactiveTime])
            );
        };
        SPECIAL_GROUP_ITEMS.file1 = function (f) {
            return groupItemTemplate(
                Msg['features_f_' + f],
                Msg._getKey('features_f_' + f + '_note', [Config.maxUploadSize / 1024 / 1024])
            );
        };
        SPECIAL_GROUP_ITEMS.storage1 = function (f) {
            return groupItemTemplate(
                Msg._getKey('features_f_' + f, [Config.defaultStorageLimit / 1024 / 1024]),
                Msg['features_f_' + f + '_note']
            );
        };
        SPECIAL_GROUP_ITEMS.storage2 = function (f) {
            return groupItemTemplate(
                Msg['features_f_' + f],
                Msg._getKey('features_f_' + f + '_note', [Config.premiumUploadSize / 1024 / 1024])
            );
        };

        var groupItem = function (key) {
            return (SPECIAL_GROUP_ITEMS[key] || defaultGroupItem)(key);
        };

        var anonymousFeatures =
            h('div.col-12.col-sm-4.cp-anon-user',[
                h('div.card',[
                    h('div.title-card',[
                        h('h3.text-center',Msg.features_anon)
                    ]),
                    h('div.card-body.cp-pricing',[
                        h('div.text-center', '0€'),
                        h('div.text-center', Msg.features_noData),
                    ]),
                    h('ul.list-group.list-group-flush', ['apps', 'file0', 'core', 'cryptdrive0', 'storage0'].map(groupItem)),
                ]),
            ]);

        var registeredFeatures =
            h('div.col-12.col-sm-4.cp-regis-user',[
                h('div.card',[
                    h('div.title-card',[
                        h('h3.text-center',Msg.features_registered)
                    ]),
                    h('div.card-body.cp-pricing',[
                        h('div.text-center', '0€'),
                        h('div.text-center', Msg.features_noData),
                    ]),
                    h('ul.list-group.list-group-flush', ['anon', 'social', 'file1', 'cryptdrive1', 'devices', 'storage1'].map(groupItem)),
                    h('div.card-body',[
                        h('div.cp-features-register#cp-features-register', [
                            h('a', {
                                href: '/register/'
                            }, h('button.cp-features-register-button', Msg.features_f_register))
                        ]),
                    ]),
                ]),
            ]);
        var premiumFeatures =
            h('div.col-12.col-sm-4.cp-anon-user',[
                h('div.card',[
                    h('div.title-card',[
                        h('h3.text-center',Msg.features_premium)
                    ]),
                    h('div.card-body.cp-pricing',[
                        h('div.text-center', h('a', {
                            href: accounts.upgradeURL,
                            target: '_blank'
                        }, Msg._getKey('features_pricing', ['5', '10', '15']))),
                        h('div.text-center', Msg.features_emailRequired),
                    ]),
                    h('ul.list-group.list-group-flush', ['reg', 'storage2', 'support', 'supporter'].map(groupItem)),
                    h('div.card-body',[
                        h('div.cp-features-register#cp-features-subscribe', [
                            premiumButton
                        ]),
                        LocalStore.isLoggedIn() ? undefined : h('div.cp-note', Msg.features_f_subscribe_note)
                    ]),
                ]),
            ]);
        var availableFeatures =
            Config.allowSubscriptions ?
                [anonymousFeatures, registeredFeatures, premiumFeatures] :
                [anonymousFeatures, registeredFeatures];

        return h('div#cp-main', [
            Pages.infopageTopbar(),
            h('div.container.cp-container',[
                h('div.row.cp-page-title',[
                    h('div.col-12.text-center', h('h1', Msg.features_title)),
                ]),
                h('div.row.cp-container.cp-features-web.justify-content-sm-center', availableFeatures),
            ]),
            Pages.infopageFooter()
        ]);
    };
});

