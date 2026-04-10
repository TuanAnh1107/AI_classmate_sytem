import type { StudentAssignmentQuestion } from '../../../models/student/student.types'
import { getCompletionStatusMeta } from '../../../models/student/student.mappers'
import { AttachmentList } from '../shared/AttachmentList'
import { DisclosureSection } from '../shared/DisclosureSection'
import { FileUploadField } from '../shared/FileUploadField'
import { StatusBadge } from '../shared/StatusBadge'
import { TextArea } from '../shared/TextArea'

type AssignmentSubmissionQuestionCardProps = {
  question: StudentAssignmentQuestion
}

export function AssignmentSubmissionQuestionCard({ question }: AssignmentSubmissionQuestionCardProps) {
  const completionMeta = getCompletionStatusMeta(question.completionStatus)

  return (
    <article className="assignment-question-card">
      <header className="assignment-question-head">
        <div>
          <p className="assignment-question-label">Câu {question.order}</p>
          <h3>{question.prompt}</h3>
        </div>
        <div className="assignment-question-meta">
          <StatusBadge label={completionMeta.label} tone={completionMeta.tone} />
          <span>{question.rubric.length} tiêu chí</span>
        </div>
      </header>

      <div className="assignment-work-meta assignment-work-meta-block">
        {question.attachmentName ? <span>Tệp giảng viên: {question.attachmentName}</span> : <span>Không có tệp đính kèm</span>}
        <span>{question.uploadedFiles.length} tệp bài làm</span>
      </div>

      <DisclosureSection
        title="Làm bài và đính kèm cho câu này"
        kicker="Question workspace"
        description="Mặc định chỉ hiện phần tóm tắt để bạn quét toàn bộ câu hỏi nhanh hơn. Mở ra khi cần nhập câu trả lời hoặc tải tệp."
        className="assignment-inline-disclosure"
      >
        <section className="assignment-question-rubric">
          <h4>Tiêu chí chấm tóm tắt</h4>
          <ul>
            {question.rubric.map((item) => (
              <li key={item.id}>
                <strong>{item.label}</strong>
                <span>{item.detail}</span>
                <em>{item.maxScore} điểm</em>
              </li>
            ))}
          </ul>
        </section>

        <section className="assignment-answer-block">
          <h4>Câu trả lời văn bản</h4>
          <TextArea defaultValue={question.answerText} placeholder="Nhập nội dung trả lời tại đây." />
        </section>

        <section className="assignment-upload-block">
          <h4>Đính kèm tệp</h4>
          <FileUploadField
            label="Tải tệp cho câu hỏi"
            helper="Chấp nhận PDF, DOCX hoặc ảnh minh chứng theo yêu cầu."
          />
          <AttachmentList items={question.uploadedFiles.map((file) => `${file.fileName} · ${file.sizeLabel}`)} />
        </section>
      </DisclosureSection>
    </article>
  )
}


