import { CheckBoxInterface } from "./";
import { View, Property, booleanConverter } from "ui/core/view";
import { Color } from "color";
import { isAndroid, device } from "platform";
import { Font } from "ui/styling/font";
import enums = require("ui/enums");
import style = require("ui/styling/style");
import app = require("application");
import { backgroundColorProperty, colorProperty, fontInternalProperty } from "ui/core/view";
declare var android: any;

const textProperty = new Property<CheckBox, string>({
    name: "text"
});
const fillColorProperty = new Property<CheckBox, string>({
    name: "fillColor"
});
const tintColorProperty = new Property<CheckBox, string>({
    name: "tintColor"
});
const checkedProperty = new Property<CheckBox, boolean>({
    name: "checked",
    valueConverter: booleanConverter
});

export class CheckBox extends View implements CheckBoxInterface {
    public checkStyle: string;
    public checkPadding: string;
    public checkPaddingLeft: string;
    public checkPaddingTop: string;
    public checkPaddingRight: string;
    public checkPaddingBottom: string;

    constructor() {
        super();
    }

    [fillColorProperty.setNative](value: string) {
        this.setButtonTintList(value);
    }

    [tintColorProperty.setNative](value: string) {
        this.setButtonTintList(value);
    }

    private setButtonTintList(value: string) {
        if (device.sdkVersion >= "21") {
            this.nativeView.setButtonTintList(android.content.res.ColorStateList.valueOf(new Color(value).android));
        }
    }

    [backgroundColorProperty.setNative](value: Color) {
        this.nativeView.setTextColor(value.android);
    }

    [colorProperty.setNative](value: Color) {
        this.nativeView.setTextColor(value.android);
    }

    [fontInternalProperty.setNative](value: Font) {
        if (value) {
            var typeface = value.getAndroidTypeface();
            this.nativeView.setTypeface(typeface);
            this.nativeView.setTextSize(value.fontSize);
        }
    }

    [textProperty.setNative](value: string) {
        this.nativeView.setText(value);
    }

    [checkedProperty.setNative](value: boolean) {
        this.nativeView.setChecked(value);
    }

    public createNativeView() {
        let _nativeView = new android.support.v7.widget.AppCompatCheckBox(this._context, null);

        if (this.checkPaddingLeft) {
            _nativeView.setPadding(parseInt(this.checkPaddingLeft), _nativeView.getPaddingTop(), _nativeView.getPaddingRight(), _nativeView.getPaddingBottom());
        }

        if (this.checkPaddingTop) {
            _nativeView.setPadding(_nativeView.getPaddingLeft(), parseInt(this.checkPaddingTop), _nativeView.getPaddingRight(), _nativeView.getPaddingBottom());
        }

        if (this.checkPaddingRight) {
            _nativeView.setPadding(_nativeView.getPaddingLeft(), _nativeView.getPaddingTop(), parseInt(this.checkPaddingRight), _nativeView.getPaddingBottom());
        }

        if (this.checkPaddingBottom) {
            _nativeView.setPadding(_nativeView.getPaddingLeft(), _nativeView.getPaddingTop(), _nativeView.getPaddingRight(), parseInt(this.checkPaddingBottom));
        }

        if (this.checkPadding) {
            let pads = this.checkPadding.toString().split(',');
            switch (pads.length) {
                case 1:
                    _nativeView.setPadding(parseInt(pads[0]), parseInt(pads[0]), parseInt(pads[0]), parseInt(pads[0]));
                    break;
                case 2:
                    _nativeView.setPadding(parseInt(pads[0]), parseInt(pads[1]), parseInt(pads[0]), parseInt(pads[1]));
                    break;
                case 3:
                    _nativeView.setPadding(parseInt(pads[0]), parseInt(pads[1]), parseInt(pads[2]), parseInt(pads[1]));
                    break;
                case 4:
                    _nativeView.setPadding(parseInt(pads[0]), parseInt(pads[1]), parseInt(pads[2]), parseInt(pads[3]));
                    break;
            }
        }

        /// works with class styling - Brad
        if (!this.style.fontSize) {
            this.style.fontSize = 15;
        }

        if (this.checkStyle) {
            const drawable = app.android.context.getResources().getIdentifier(this.checkStyle, "drawable", app.android.context.getPackageName());
            _nativeView.setButtonDrawable(drawable);
        }

        var that = new WeakRef(this);

        _nativeView.setOnCheckedChangeListener(new android.widget.CompoundButton.OnCheckedChangeListener({
            get owner() {
                return that.get();
            },

            onCheckedChanged: function (sender, isChecked) {
                if (this.owner) {
                    checkedProperty.nativeValueChange(this.owner, isChecked);
                }
            }
        }));

        return _nativeView;
    }

    public toggle(): void {
        this.nativeView.toggle();
    }
}

textProperty.register(CheckBox);
fillColorProperty.register(CheckBox);
tintColorProperty.register(CheckBox);
checkedProperty.register(CheckBox);