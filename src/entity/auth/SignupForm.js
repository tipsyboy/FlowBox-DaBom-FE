export default class SignupForm {
    constructor() {
        this.email = '';
        this.channelName = '';
        this.password = '';
        this.password2 = '';
        this.memberRole = 'USER';
        this.isEmailChecked = null;
        this.isChannelChecked = null;
    }

    emailCheckMessage() {
        if (this.isEmailChecked === null) {
            return '';
        } else if (this.isEmailChecked === true) {
            return '사용 가능한 이메일입니다.';
        } else {
            return '이미 사용 중인 이메일입니다.';
        }
    }

    channelCheckMessage() {
        if (this.isChannelChecked === null) {
            return '';
        } else if (this.isChannelChecked === true) {
            return '사용 가능한 채널명입니다.';
        } else {
            return '이미 사용 중인 채널명입니다.';
        }
    }
}